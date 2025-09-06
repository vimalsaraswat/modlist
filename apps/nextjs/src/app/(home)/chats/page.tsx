import Link from "next/link";

import { cn } from "@acme/ui";
import { Card, CardContent } from "@acme/ui/card";

import { getSession } from "~/auth/server";
import UserAvatar from "~/components/common/user-avatar";
import { api } from "~/trpc/server";

export default async function ChatListPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        You must be signed in to view your chats.
      </div>
    );
  }

  const trpc = await api();
  const chats = await trpc.chat.myChats();

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-semibold text-foreground">Your Chats</h1>

      {chats.length === 0 ? (
        <p className="text-muted-foreground">No conversations yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {chats.map((chat, i) => (
            <Link href={`/chats/${chat.id}`} key={chat.id}>
              <Card
                className={cn(
                  "rounded-sm transition-shadow duration-200 ease-in-out hover:shadow-md",
                  i === 0 && "rounded-t-xl",
                  i === chats.length - 1 && "rounded-b-xl",
                )}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <UserAvatar
                    name={chat.participantUser.name ?? ""}
                    imageUrl={chat.participantUser.image}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium text-foreground">
                      {chat.participantUser.name ?? "Unknown User"}
                    </p>
                    {/*<p className="truncate text-sm text-muted-foreground">
                      {chat.participantUser.email}
                    </p>*/}
                  </div>
                  {chat.lastMessage?.type === "text" && (
                    <p className="truncate text-sm text-muted-foreground">
                      {chat.lastMessage.text ?? `[${chat.lastMessage.type}]`}
                    </p>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
