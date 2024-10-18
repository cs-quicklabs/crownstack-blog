---
title: 'Implementation of temporary file upload on AWS using presigned url'
date: '2024-10-18'
lastmod: '2024-10-18'
tags: ['cloud', 'aws', 'presigned url']
draft: false
summary: 'This blog will provide a comprehensive guide on generating presigned urls for temporary uploads to AWS servers.'
layout: PostSimple
images: []
authors: ['sonu-daryani']
---

# Introduction

Pre-signed urls are a secure way to temporarily access resources in Amazon S3 (Simple Service) without exposing your AWS credentials. This feature is especially useful for applications that need to manage data stored in S3. 

## How does it work?

1. **Creation**: A presigned url is generated using an AWS SDK (Software Development Kit) or through the AWS CLI (Command Line Interface). 
When you create the url, you specify:
    -	The S3 bucket and object key.
    -	The HTTP method (GET, PUT, etc.) that will be allowed.
    -	An expiration time, which defines how long the url remains valid (typically from a few minutes to several hours). 

2. **Signing**: The presigned url is signed with your AWS credentials (access key and secret key). This signature is included in the url and identifies the request when someone tries to access the resource. 
3. **Accessing the Resource**: If the signature is valid and the url has not expired, the user can access the specified resource. We can adjust the access controls so that only those can access the resource who is authenticated with the give link. 

## Example in NextJs

#### **Backend**
- Generate presigned url with an expiration of 60 mins

![AWS Presigned Url](/static/images/blogs/cloud/aws/implementation-of-temporary-file-upload-on-aws-using-presigned-url/step-1.png 'AWS Presigned Url')

#### **Frontend**
- Uploading file using presigned url

![AWS Presigned Url](/static/images/blogs/cloud/aws/implementation-of-temporary-file-upload-on-aws-using-presigned-url/step-2.png 'AWS Presigned Url')

## **Use Cases**

-	**Secure Transient Data**: Securely share data with users without having to authenticate to AWS. 
-	**Upload Access**: Allow users to upload files directly to S3 without exposing your credentials.
-	**Control**: restrict access to specific activities (such as downloading or uploading) during a specified time period.
