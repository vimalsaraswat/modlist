import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export function apiEnv() {
  return createEnv({
    server: {
      AWS_ACCESS_KEY_ID: z.string().min(1),
      AWS_SECRET_ACCESS_KEY: z.string().min(1),
      AWS_ENDPOINT_URL_S3: z.string().min(1),
      AWS_ENDPOINT_URL_IAM: z.string().min(1),
      AWS_REGION: z.string().min(1),
      S3_BUCKET_NAME: z.string().min(1),
    },
    experimental__runtimeEnv: {},
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
}
