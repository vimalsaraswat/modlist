import { z } from "zod/v4";

export * from "./listing";

export const unused = z.string().describe(
  `This lib is currently not used as we use drizzle-zod for simple schemas
   But as your application grows and you need other validators to share
   with back and frontend, you can put them in here
  `,
);

export const emailSchema = z.email({ message: "Invalid email address" });
export const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, { message: "Phone must be 10 digits" });
export const otpSchema = z
  .string()
  .length(6, { message: "OTP must be 6 digits" });
