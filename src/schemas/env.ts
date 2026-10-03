import { z } from "zod";

export const envSchema = z.object({
  AWS_REGION: z.string().min(1),
  SQS_QUEUE_URL: z.url(),
  S3_BUCKET: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1).default("gpt-4.1-mini"),
});
