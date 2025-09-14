import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  createAuthMiddleware,
  emailOTP,
  oAuthProxy,
  openAPI,
  phoneNumber,
} from "better-auth/plugins";

import { db } from "@acme/db/client";
import { sendEmail } from "@acme/email";
import { sendSMS } from "@acme/message";

import { welcomeEmailHtml, welcomeEmailText } from "./welcome-email";

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;

  googleClientId: string;
  googleClientSecret: string;
}) {
  const config = {
    rateLimit: {
      enabled: true,
      window: 60, // time window in seconds
      max: 100, // max requests in the window
      customRules: {
        "/email-otp/send-verification-otp": {
          window: 60,
          max: 3,
        },
        "/phone-number/send-otp": {
          window: 60,
          max: 3,
        },
        "/get-session": {
          window: 60,
          max: 120,
        },
      },
    },
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
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google"],
      },
    },
    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        const newSession = ctx.context.newSession;

        if (newSession) {
          const now = new Date();
          const userCreationDate = new Date(newSession.user.createdAt);
          const timeDifference = now.getTime() - userCreationDate.getTime();

          // 5000ms = 5s
          if (timeDifference < 5000) {
            const html = welcomeEmailHtml(
              newSession.user.name.trim()
                ? newSession.user.name
                : newSession.user.email,
              options.baseUrl,
            );
            const text = welcomeEmailText(
              newSession.user.name.trim()
                ? newSession.user.name
                : newSession.user.email,
              options.baseUrl,
            );
            await sendEmail({
              to: newSession.user.email,
              subject: "Welcome to MODLIST",
              html,
              text,
            });
          }
        }
      }),
    },
    plugins: [
      oAuthProxy({
        /**
         * Auto-inference blocked by https://github.com/better-auth/better-auth/pull/2891
         */
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
      expo(),
      openAPI(),
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
            await sendEmail({
              to: email,
              subject: "Your sign-in code for MODLIST",
              html: `<p>Your sign-in code is <strong>${otp}</strong>.</p><p>This code is valid for a short period. Do not share it with anyone.</p>`,
              text: `Your sign-in code is ${otp}. This code is valid for a short period. Do not share it with anyone.`,
            });
          } else {
            // Send the OTP for password reset
          }
        },
      }),
      phoneNumber({
        sendOTP: async ({ phoneNumber, code }) => {
          await sendSMS({
            body: `MODLIST verification code is ${code}`,
            to: phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`,
          });
        },
        // signUpOnVerification: {
        //   getTempEmail: () => {
        //     // ${phoneNumber}@my-site.com
        //     return "";
        //   },

        //   getTempName: (phoneNumber) => {
        //     return phoneNumber;
        //   },
        // },
      }),
    ],
    emailVerification: {
      autoSignInAfterVerification: true,
    },
    emailAndPassword: {
      enabled: true,
    },
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
