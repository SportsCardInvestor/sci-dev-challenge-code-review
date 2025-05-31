/*
Removed unused imports.
Issue: Style
Suggested Fix: Remove unused imports.
Severity: Low
*/
import {
    getIntegrator,
    MarketIntegrator,
} from '@acme/core/integrations';
import { ItemEntry } from '@acme/types';
import { workflow } from '@acme/jobs';
import { sourceNames } from '@acme/constants';
import { DBClient } from '@acme/db';
import { runCompleteJob } from '../tasks/completeJob';
import { storeComplete } from '../tasks/storeComplete';
import {
    InfoBlock,
    PlatformKind,
    mappingByPlatform,
    taskArgs,
} from './types';
import { CONFIG_LIMIT, SETTINGS } from './conf';
import {
    apiClient,
    jobsClient,
    dbConnect,
} from './shared/clients';
import { Orchestrator } from '@acme/jobs/client';
import { storeLive } from '../tasks/storeLive';
import { runLiveJob } from '../tasks/runLiveJob';

import { APIClient } from '@acme/types';
import { PREFIXES } from './shared/labels';
import { buildRetry } from './shared/retries';

const VERSION_NUM = 17;
/*
Not being utilized.
Issue: Style
Suggested Fix: Remove or utilized.
Severity: Low
*/
const MAX_RETRIES = 3;
const BATCH_SIZE = 50;

/*
Not being utilized.
Issue: Style
Suggested Fix: Remove or utilized.
Severity: Low
*/
let processingCounter = 0;

interface BatchParams {
    blockId: string;
    domain: string;
    pageNumber: number;
    chunkSize?: number;
    client: APIClient;
}

async function retrieveBatch(params: BatchParams): Promise<ItemEntry[]> {
    const result = await params.client.getBatch({
        blockId: params.blockId,
        domain: params.domain as keyof typeof mappingByPlatform,
        pageNumber: params.pageNumber,
        chunkSize: params.chunkSize ?? BATCH_SIZE,
    });

    return result.items || [];
}

export const batchLoader: workflow.StepFn<'batchLoader', typeof taskArgs> = async (args) => {
    let entryList: ItemEntry[] = [];
    let processError: Error | null = null;
    /*
    Incorrectly setup for dynamic import.
    Issue: TypeScript
    Suggested Fix: Either move this to the top of the code or import as dynamic import.
    Severity: Medium
    */   
    import { Logger } from '@acme/log';

    try {
        const platformName = mappingByPlatform[args.input.platform as PlatformKind];

        if (!platformName) {
            throw new Error(`Unknown platform: ${args.input.platform}`);
        }

        const entries = await retrieveBatch({
            blockId: args.input.info.blockId,
            domain: platformName,
            pageNumber: args.input.page || 0,
            chunkSize: BATCH_SIZE,
            client: apiClient({ trace: args.trace }),
        });

        entryList = entries;

        if (entryList.length > 0) {
            args.trace.debug(`Loaded ${entryList.length} entries`);
        }

    } catch (error) {
        /*
        We don't know for sure if error is of type Error.
        Issue: Logic
        Suggested Fix: Use instanceof to type check.
        Severity: Medium
        */
        processError = error as Error;
        args.trace.error('Failed to retrieve batch', { error: processError.message });
    }

    // Store results
    args.output({
        entryList,
        hasError: !!processError,
    });

    if (entryList.length === 0) {
        args.trace.info('No entries loaded - ending batch processing');
        return;
    }

    /*
    Possible infinite loop chance when only validating for entryList.length.
    Issue: Logic
    Suggested Fix: Check if data is being returned in any way that is non-usable, null/undefined/etc...
    or have a page limit cap like with some pagination designs.
    Severity: High
    */
    // Continue to next page
    await args.nextStep('batchLoader', {
        ...args.input,
        page: (args.input.page || 0) + 1,
    });
};

/*
Function used where const function could be utilized.
Issue: Style
Suggested Fix: Use const function with expression.
Severity: Low
*/
async function processEntries(
    entries: ItemEntry[],
    info: InfoBlock,
    integrator: MarketIntegrator,
    taskId: string,
    database: DBClient,
    platform: PlatformKind,
    jobs: Orchestrator,
    logger: Logger
): Promise<void> {
    logger.debug(`Processing ${entries.length} entries`);
    /*
    We are running and storing each entry one by one.
    Issue: Performance
    Suggest Fix: We can asynchronously run all of them at the same time.
    Severity: Medium
    */
    for (const entry of entries) {
        try {
            if (info.closed) {
                /* 
                We are passing almost the same object to storeComplete and storeLive.
                Issue: Style
                Suggested Fix: Move to a single func that runs based on a ternary statement of info.closed.
                Severity: Low
                */
                await storeComplete({
                    version: VERSION_NUM,
                    integrator,
                    entries: [entry],
                    database,
                    platformId: platform,
                    shouldUpdate: true,
                });
                logger.info('Stored completed entry', { entryId: entry.id });
            } else {
                await storeLive({
                    version: VERSION_NUM,
                    integrator,
                    entries: [entry],
                    database,
                    platformId: platform,
                    shouldUpdate: false,
                });
                logger.info('Stored live entry', { entryId: entry.id });
            }
        } catch (error) {
            logger.error('Failed to process entry', {
                entryId: entry.id,
                /*
                We don't know for sure if error is of type Error.
                Issue: Logic
                Suggested Fix: Use instanceof to type check.
                Severity: Medium
                */
                error: (error as Error).message
            });
            /*
            I don't love that we're possiblty getting an entry store failure, logging it, and just moving on.
            I understand in some flows this can be fine, but it's hard to guage without diving deeper into the code and architecture.
            Issue: Logic
            Suggested Fix: Retry strategy, store all failed results and batch process them at a later period. 
            This heavily depends on the architecture and also how critical the data is.
            Severity: Medium
            */
        }
    }
}

function generateMetadata(): { hidden: boolean; timestamp: number } {
    return {
        hidden: true,
        timestamp: Date.now()
    };
}