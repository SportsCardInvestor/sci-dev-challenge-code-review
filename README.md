### Accesssing / Using Deployed MTG CDK Applicaton

To access the MTG Wizard API that is deployed to AWS, please use the following URL:
[https://yfsl0iyxjb.execute-api.us-east-1.amazonaws.com/prod/wizards](https://yfsl0iyxjb.execute-api.us-east-1.amazonaws.com/prod/wizards)


IF you prefer to deploy the application yourself, you'll want to ensure that the following secrets are defined in github actions before deploying to the `cdk-solved` or `main` branches.

- `AWS_ACCOUNT_ID`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

**Note:** Be sure that the IAM credentials provisioned have the correct policies associated with them to prevent the CDK deployment from failing. There is no need to boostrap cdk as the cdk boostrap step was including in the deployment file. 

### Additional Information

The packages/apis used are the following:
- pnpm
- MTG API 
- AWS CDK


### Code Review

The solved code reviews can be found in the `_code-review-solved` folder. 

- `lessobnoxiouscode.reviewed.ts`
- `nightmare.reviewed.sql`

