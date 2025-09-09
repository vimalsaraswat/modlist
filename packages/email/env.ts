import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export function emailEnv() {
  return createEnv({
    server: {
      SMTP_HOST: z.string().min(1),
      SMTP_PORT: z.string().min(1),
      SMTP_USER: z.string().min(1),
      SMTP_PASS: z.string().min(1),
      SMTP_FROM_EMAIL: z.string().min(1),
    },
    experimental__runtimeEnv: {},
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
}
