---
title: 'How to Generate AWS Presigned URLs for Secure File Uploads and Downloads'
date: '2024-11-4'
lastmod: '2024-11-4'
tags: ['cloud', 'aws']
draft: false
summary: 'This blog will provide a comprehensive guide on generating presigned URLs for temporary, secure file uploads and downloads to and from AWS S3. You’ll learn how to leverage presigned URLs to handle user uploads directly to S3, without exposing sensitive AWS credentials.'
layout: PostSimple
images: []
authors: ['sonu-daryani']
---

## Introduction

AWS S3 (Simple Storage Service) is a widely-used solution for storing and managing data in the cloud. However, one major concern when handling data in S3 is maintaining security—especially when allowing users to upload or download files directly. This is where **presigned URLs** come in handy.

**Presigned URLs** allow secure, time-limited access to S3 resources, enabling users to upload or download files without exposing your AWS credentials or over-granting permissions. This feature is particularly valuable for applications where users or services need to access S3 objects temporarily and securely.

## Why Use Presigned URLs?

Presigned URLs provide a controlled and flexible way to grant temporary access to S3 objects. Here’s why they’re so useful:

- **Security**: Users or applications can access S3 objects without exposing sensitive AWS credentials.
- **Granular Access Control**: Control which HTTP method (e.g., `GET`, `PUT`) is allowed and define an expiration time to limit access duration.
- **Efficient Data Handling**: Enable direct uploads or downloads to and from S3, offloading the server’s responsibility and reducing the risk of server-side file handling errors or bottlenecks.

With presigned URLs, you avoid managing complex permission structures for individual users or services. Instead, you provide a secure link that expires automatically, reducing risk in cases where URL exposure might happen.

## How Does a Presigned URL Work?

Presigned URLs are straightforward in their concept but powerful in their execution. Here’s how they work:

1. **Creation**: Generate a presigned URL using the AWS SDK (Software Development Kit) or the AWS CLI (Command Line Interface).

   - Specify the **S3 bucket** and **object key** (the file name or path).
   - Define the **HTTP method** (like `GET` for downloading or `PUT` for uploading).
   - Set an **expiration time** (e.g., from a few minutes to several hours).

2. **Signing**: When you generate the URL, AWS signs it using your credentials (access key and secret key). This signature is embedded in the URL, which validates the request when accessed.

3. **Accessing the Resource**: If the URL has a valid signature and hasn’t expired, the user can perform the allowed action (such as uploading or downloading the file). This controlled access ensures only those with the presigned link can interact with the specified S3 object.

## Practical Example: Implementing Presigned URLs in Next.js

Here’s a quick example of how presigned URLs can be used in a Next.js application to allow file uploads to S3.

### **Backend**: Generating the Presigned URL

On the backend, we create an endpoint to generate presigned URLs with a 60-minute expiration. This URL is sent to the frontend, enabling users to upload their files directly to S3.

```javascript
import AWS from 'aws-sdk'
import { NextRequest, NextResponse } from 'next/server'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
})

export async function POST(req) {
  try {
    const { fileName, fileType } = await req.json()

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Expires: 60 * 60, // 1 hour
      ContentType: fileType,
      ACL: 'public-read',
    }

    const url = await s3.getSignedUrlPromise('putObject', s3Params)
    return NextResponse.json({ url }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### **Frontend**: Uploading a File Using the Presigned URL

On the frontend, use the presigned URL to upload a file directly to S3. By uploading directly, you avoid routing large files through your backend server, which saves time and resources.

```javascript
import axios from 'axios'

async function uploadFile(file) {
  try {
    // Request presigned URL from the backend
    const { data } = await axios.post('/api/generatePresignedUrl', {
      fileName: encodeURIComponent(file.name),
      fileType: file.type,
    })

    // Upload file directly to S3 using axios
    await axios.put(data.url, file, {
      headers: {
        'Content-Type': file.type,
      },
    })

    console.log('File uploaded successfully!')
  } catch (error) {
    console.error('Error uploading file:', error)
  }
}
```

## **Use Cases for Presigned URLs**

Presigned URLs have versatile applications in various scenarios. Here are some common use cases:

- **Secure Transient Data**: Share sensitive data with users securely without exposing AWS credentials. For instance, share a download link for a report that expires after a set time.
- **Direct User Uploads**: Allow users to upload files (like profile pictures or documents) directly to S3. This offloads file storage from your backend while ensuring that only authenticated uploads are permitted.
- **Temporary Access Control**: Limit access to specific actions (like downloading) within a defined time frame, allowing temporary file access for specific users or processes.
- **Event-Triggered Access**: Provide time-limited access to a specific resource after a triggering event, such as generating a downloadable link upon purchase.

## Conclusion

Presigned URLs offer a practical, secure solution for managing access to AWS S3 resources. By generating time-limited, action-specific URLs, you can ensure secure data access and file uploads without overexposing your AWS credentials or resources. Whether you need to allow secure uploads, downloads, or time-sensitive access, presigned URLs make it possible with minimal configuration and maximum security.
