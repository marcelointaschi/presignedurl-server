import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, CompleteMultipartUploadCommand, CompleteMultipartUploadOutput } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: process.env.region,
});

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    try {
        if (event.body !== null && event.body !== undefined) {
            const bodyData = JSON.parse(event.body);

            const params = {
                Bucket: bodyData.bucketName,
                Key: bodyData.fileKey,
                MultipartUpload: {
                    Parts: bodyData.parts, // an object containing an array of ETag and PartNumber from the chunk uploads
                },
                UploadId: bodyData.fileId,
            };

            const command: CompleteMultipartUploadCommand = new CompleteMultipartUploadCommand(params);
            const data: CompleteMultipartUploadOutput = await s3.send(command);

            console.log(`result: ${JSON.stringify(data)}`);

            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify(data),
            };
        } else {
            response = {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: 'No data',
            };
        }
    } catch (e) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: `ERROR ${e}`,
        };
    }

    return response;
};
