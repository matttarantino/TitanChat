import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'

const BUCKET_NAME = 'cs554-project-titan-bucket'
const REGION = 'us-east-2'
export const BUCKET_URL = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com`

const bucket = new S3Client({
  region: REGION,
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
      Bucket: BUCKET_NAME,
      Key: filePath,
      Body: file,
    })
  )

export const getFile = (filePath: string) =>
  bucket.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
    })
  )

export const deleteFile = (filePath: string) => {}
