#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MtgWizardsApiStack } from '../lib/mtg-wizards-api-stack';

const app = new cdk.App();
new MtgWizardsApiStack(app, 'MtgWizardsApiStack', {
    env: {
        account: process.env.AWS_ACCOUNT_ID,
        region: process.env.AWS_REGION,
    }
});
