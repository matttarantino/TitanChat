import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const bucket = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY as string,
  },
})

/**
 * @author rgorai
 * @description uploads a file to our AWS S3 bucket
 * @param file the file source
 * @param filePath the path to store the file upload
 * @returns void promise
 */
export const uploadFile = (file: File, filePath: string) =>
  bucket.send(
    new PutObjectCommand({
      Bucket: 'cs554-project-titan-bucket',
      Key: filePath,
      Body: file,
    })
  )

export const deleteFile = (filePath: string) => {}
