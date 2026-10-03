import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "./config.js";

const s3 = new S3Client({ region: env.AWS_REGION });

export async function uploadFile(
  key: string,
  body: Buffer | string,
  contentType: string,
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}
