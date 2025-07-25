import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@acme/ui/button";

import { auth, getSession } from "~/auth/server";

export async function AuthShowcase() {
  const session = await getSession();

  if (!session) {
    return (
      <form>
        <Button
          variant="ghost"
          className="text-zinc-300 hover:text-white"
          formAction={async () => {
            "use server";
            const res = await auth.api.signInSocial({
              body: {
                provider: "google",
                callbackURL: "/",
              },
            });
            if (!res.url) {
              throw new Error("No URL returned from signInSocial");
            }
            redirect(res.url);
          }}
        >
          Sign In
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-2">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={`${session.user.name}'s avatar`}
            className="h-16 w-16 rounded-full"
          />
        )}
        <p className="text-center text-2xl">
          <span>{session.user.name}</span>
        </p>
      </div>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await auth.api.signOut({
              headers: await headers(),
            });
            redirect("/");
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
