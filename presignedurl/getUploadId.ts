import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, CreateMultipartUploadCommand, CreateMultipartUploadOutput } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: process.env.region,
});

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    if (!event.queryStringParameters || !event.queryStringParameters.bucketName) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: 'value parameter is missing',
        };
        return response;
    }

    const params = {
        Bucket: event.queryStringParameters.bucketName,
        Key: event.queryStringParameters.fileName,
    };

    const command: CreateMultipartUploadCommand = new CreateMultipartUploadCommand(params);
    const multipartUpload: CreateMultipartUploadOutput = await s3.send(command);

    response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            fileId: multipartUpload.UploadId,
            fileKey: multipartUpload.Key,
        }),
    };
    return response;
};
