import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, UploadPartCommand } from '@aws-sdk/client-s3';

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

    const parts = Number(event.queryStringParameters.partNumber);

    const params = {
        Bucket: event.queryStringParameters.bucketName,
        Key: event.queryStringParameters.fileKey,
        UploadId: event.queryStringParameters.fileId,
    };

    const list = [];

    for (let index = 0; index < parts; index++) {
        const command = new UploadPartCommand({
            ...params,
            PartNumber: index + 1,
        });
        list.push(await s3.send(command));
    }

    const urls = list.map((signedUrl, index) => {
        return {
            signedUrl: signedUrl,
            PartNumber: index + 1,
        };
    });

    response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            parts: urls,
        }),
    };
    return response;
};
