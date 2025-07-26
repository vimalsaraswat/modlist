"use client";

import { usePathname } from "next/navigation";

import { Button } from "@acme/ui/button";
import { toast } from "@acme/ui/toast";

import { signIn } from "~/actions/auth";

export default function SignInButton() {
  const pathName = usePathname();

  const handleSignIn = async () => {
    try {
      await signIn(pathName);
      toast.success("Signed in successfully!");
    } catch (err) {
      console.log("Error logging user in: ", err);
      toast.error("Failed to sign in.");
    }
  };

  return (
    <form action={handleSignIn}>
      <Button type="submit">Sign In</Button>
    </form>
  );
}
