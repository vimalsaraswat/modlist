import * as SecureStore from "expo-secure-store";
import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient, phoneNumberClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { getBaseUrl } from "./base-url";

console.log("getBaseUrl", getBaseUrl());

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    expoClient({
      scheme: "modlist",
      storagePrefix: "modlist",
      storage: SecureStore,
    }),
    emailOTPClient(),
    phoneNumberClient(),
  ],
});
