import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { getSession } from "~/auth/server";
import SignInButton from "./auth/sign-in-btn";
import UserAvatar from "./common/user-avatar";

export async function UserAccountNav() {
  const session = await getSession();

  if (!session) {
    return <SignInButton />;
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
        <Link
          href="/profile"
          className="flex items-center justify-start gap-2 p-2"
        >
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
        </Link>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Settings</Link>
        </DropdownMenuItem> */}
        {/* <DropdownMenuSeparator /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
