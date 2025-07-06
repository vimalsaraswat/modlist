import { headers } from "next/headers";
// import Link from "next/link";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { auth, getSession } from "~/auth/server";

export async function UserAccountNav() {
  const session = await getSession();

  if (!session) {
    return (
      <form>
        <Button
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
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="h-8 w-8"
          name={session.user.name}
          imageUrl={session.user.image}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <UserAvatar
            className="h-8 w-8"
            name={session.user.name}
            imageUrl={session.user.image}
          />
          <div className="flex flex-col space-y-1 leading-none">
            {session.user.name && (
              <p className="font-medium">{session.user.name}</p>
            )}
            {session.user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {session.user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Settings</Link>
        </DropdownMenuItem> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem className="cursor-pointer" asChild>
          <form>
            <button
              className="w-full"
              formAction={async () => {
                "use server";
                await auth.api.signOut({
                  headers: await headers(),
                });
                redirect("/");
              }}
            >
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserAvatar({
  imageUrl,
  name,
  ...props
}: React.ComponentProps<typeof Avatar> & {
  imageUrl?: string | null;
  name: string;
}) {
  return (
    <>
      <Avatar {...props} className="">
        {/* <img src={imageUrl} className="h-4 min-w-4" /> */}
        {imageUrl ? (
          <AvatarImage
            alt="Picture"
            src={
              imageUrl ||
              "https://res.cloudinary.com/dwi9tuxwe/image/upload/v1742052880/koa0hosthzzmpeq9140v.jpg"
            }
          />
        ) : (
          <AvatarFallback>
            <span className="sr-only">{name}</span>
          </AvatarFallback>
        )}
      </Avatar>
    </>
  );
}
