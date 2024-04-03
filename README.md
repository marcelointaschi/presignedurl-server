# Presignedurl Server
Help in the process to upload files using presignedurl

# Steps

1. getUploadId

GET https://xxxxxxxx.execute-api.us-east-2.amazonaws.com/Prod/getuploadid/?bucketName=presignurl&fileName=sound.mp3

2. getUrl

GET https://xxxxxxxx.execute-api.us-east-2.amazonaws.com/Prod/geturl/?partNumber=3&bucketName=presignurl&fileKey=sound.mp3&fileId=<ID_RETURNED_BY_PREV_CALL>

3. Send bin file via put

4. postCompleted

POST https://xxxxxxxx.execute-api.us-east-2.amazonaws.com/Prod/postcompleted/ 

Header & Body
```
content-type: application/json
{
    "bucketName": "presignurl",
    "fileKey": "sound.mp3",
    "parts" : {

    },
    "fileId" : "<FILE_ID_HERE>"
}
```

# Bucket Policy
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::presignurl/*"
        }
    ]
}
```