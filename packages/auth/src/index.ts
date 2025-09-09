import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, oAuthProxy, phoneNumber } from "better-auth/plugins";

import { db } from "@acme/db/client";
import { sendEmail } from "@acme/email";

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;

  googleClientId: string;
  googleClientSecret: string;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    user: {
      additionalFields: {
        role: {
          type: "string",
          input: false,
        },
      },
    },
    baseURL: options.baseUrl,
    secret: options.secret,
    // advanced: {
    //   useSecureCookies: true,
    // },
    plugins: [
      oAuthProxy({
        /**
         * Auto-inference blocked by https://github.com/better-auth/better-auth/pull/2891
         */
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
      expo(),
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          if (type === "sign-in") {
            await sendEmail({
              to: email,
              subject: "Your sign-in code for MODLIST",
              html: `<p>Your sign-in code is <strong>${otp}</strong>.</p><p>This code is valid for a short period. Do not share it with anyone.</p>`,
              text: `Your sign-in code is ${otp}. This code is valid for a short period. Do not share it with anyone.`,
            });
          } else if (type === "email-verification") {
            // Send the OTP for email verification
          } else {
            // Send the OTP for password reset
          }
        },
      }),
      phoneNumber({
        allowedAttempts: 8,
        sendOTP: ({ phoneNumber, code }, request) => {
          // Implement sending OTP code via SMS
          console.log(
            "Sending OTP to phone number:",
            phoneNumber,
            "with code:",
            code,
            "and request:",
            request,
          );
        },
      }),
    ],
    socialProviders: {
      google: {
        clientId: options.googleClientId,
        clientSecret: options.googleClientSecret,
        redirectURI: `${options.productionUrl}/api/auth/callback/google`,
      },
    },
    trustedOrigins: ["modlist://"],
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
