import { notFound } from "next/navigation";

import { Card, CardContent } from "@acme/ui/card";
import { Separator } from "@acme/ui/separator";

import { getSession } from "~/auth/server";
import MessageList from "~/components/chats/message-list";
import SendMessageForm from "~/components/chats/send-messge-form";
import UserAvatar from "~/components/common/user-avatar";
import { api } from "~/trpc/server";

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await getSession();
  const chatId = (await params).chatId;

  if (!session || !chatId) notFound();

  const trpc = await api();
  const chatData = await trpc.chat.byId({ chatId }).catch(() => null);
  if (!chatData) notFound();

  const { chat, participants } = chatData;
  const me = session.user.id;
  const otherUser = participants.find((p) => p.userId !== me);

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-3xl flex-col gap-4 px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <UserAvatar
          name={otherUser?.user?.name ?? ""}
          imageUrl={otherUser?.user?.image}
        />
        <div>
          <h1 className="text-lg font-semibold">
            {otherUser?.user?.name ?? "Unknown"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {otherUser?.user?.email}
          </p>
        </div>
      </div>
      <Separator />

      {/* Messages */}
      <Card className="flex w-full flex-1 flex-col overflow-hidden">
        <CardContent className="no-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto p-4">
          <MessageList chatId={chat.id} userId={me} />
        </CardContent>
      </Card>
      {/* <Card className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
          <MessageList chatId={chat.id} userId={me} />
        </CardContent>
      </Card> */}

      {/* Input */}
      <SendMessageForm chatId={chat.id} />
    </div>
  );
}
