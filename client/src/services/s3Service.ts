import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

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
 * @param s3Directory the directory path in which the
 *                    file should be stored in s3
 * @param fileName name of the file to upload (including extension)
 * @returns the complete s3 url of the file that was uploaded
 */
export const uploadFile = async (
  file: File,
  s3Directory: string,
  fileName: string
) => {
  const filePath = `${s3Directory}/${uuidv4()}-${fileName}`

  await bucket.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
      Body: file,
    })
  )

  return `${BUCKET_URL}/${filePath}`
}

export const deleteFile = (filePath: string) => {}
