"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SendIcon } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

import { useTRPC } from "~/trpc/react";

interface Props {
  chatId: string;
}

export default function SendMessageForm({ chatId }: Props) {
  const [text, setText] = useState("");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(
    trpc.chat.sendMessage.mutationOptions({
      onSuccess: async () => {
        setText("");
        await queryClient.invalidateQueries(trpc.chat.getMessages.pathFilter());
      },
      onError: (e) => console.error("Send failed", e),
    }),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) mutate({ chatId, text: text.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-0">
      <Input
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isPending}
        className="flex-1 rounded-r-none"
      />
      <Button
        type="submit"
        disabled={isPending || !text.trim()}
        className="rounded-l-none"
      >
        <SendIcon />
      </Button>
    </form>
  );
}
