import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export function messageEnv() {
  return createEnv({
    server: {
      TWILIO_ACCOUNT_SID: z.string().min(1),
      TWILIO_AUTH_TOKEN: z.string().min(1),
      TWILIO_FROM_PHONE_NUMBER: z.string().min(1),
    },
    experimental__runtimeEnv: {},
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
}
