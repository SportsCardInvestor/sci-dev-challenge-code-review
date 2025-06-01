import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class MtgWizardsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getWizardsLambda = new lambda.NodejsFunction(this, 'GetWizardsLambda', {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../lambda/getWizards.ts'),
      handler: 'handler',
    });

    const api = new apigateway.RestApi(this, 'WizardsAPI', {
      restApiName: 'MTG Wizards Service',
    });

    const wizards = api.root.addResource('wizards');
    wizards.addMethod('GET', new apigateway.LambdaIntegration(getWizardsLambda));
  }
}
