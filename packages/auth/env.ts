import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

import { emailEnv } from "@acme/email/env";
import { messageEnv } from "@acme/message/env";

export function authEnv() {
  return createEnv({
    extends: [emailEnv(), messageEnv()],
    server: {
      AUTH_GOOGLE_ID: z.string().min(1),
      AUTH_GOOGLE_SECRET: z.string().min(1),
      AUTH_SECRET:
        process.env.NODE_ENV === "production"
          ? z.string().min(1)
          : z.string().min(1).optional(),
      NODE_ENV: z.enum(["development", "production"]).optional(),
    },
    experimental__runtimeEnv: {},
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
}
