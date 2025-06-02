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
const MAX_RETRIES = 3;
const BATCH_SIZE = 50;

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

    // Continue to next page
    await args.nextStep('batchLoader', {
        ...args.input,
        page: (args.input.page || 0) + 1,
    });
};

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

    for (const entry of entries) {
        try {
            if (info.closed) {
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
                error: (error as Error).message
            });
        }
    }
}

function generateMetadata(): { hidden: boolean; timestamp: number } {
    return {
        hidden: true,
        timestamp: Date.now()
    };
}