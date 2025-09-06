import Link from "next/link";

import { getSession } from "~/auth/server";
import SignInButton from "./auth/sign-in-btn";
import UserAvatar from "./common/user-avatar";

export async function UserAccountNav() {
  const session = await getSession();

  if (!session) {
    return <SignInButton />;
  }

  return (
    <Link href="/profile">
      <UserAvatar
        className="h-9 w-9 rounded-lg"
        name={session.user.name}
        imageUrl={session.user.image}
      />
    </Link>
  );
}
