/* Amplify Params - DO NOT EDIT
	API_ADMINQUERIES_APIID
	API_ADMINQUERIES_APINAME
	API_ANNOTATIONPLATFORM_GRAPHQLAPIENDPOINTOUTPUT
	API_ANNOTATIONPLATFORM_GRAPHQLAPIIDOUTPUT
	API_ANNOTATIONPLATFORM_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = event => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  event.Records.forEach(record => {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
  });
  return Promise.resolve('Successfully processed DynamoDB record');
};
