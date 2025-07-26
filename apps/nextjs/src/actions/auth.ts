"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "~/auth/server";

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/");
}

export async function signIn(callbackURL?: string) {
  const res = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL,
    },
  });
  if (!res.url) {
    redirect("/");
  }
  redirect(res.url);
}
