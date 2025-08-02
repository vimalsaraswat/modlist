"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@acme/ui/button";
import { Textarea } from "@acme/ui/textarea";

import { useTRPC } from "~/trpc/react";

interface Props {
  postId: string;
}

export function ReplyForm({ postId }: Props) {
  const [value, setValue] = useState("");
  const router = useRouter();
  const trpc = useTRPC();

  const { mutateAsync, isPending } = useMutation(
    trpc.forum.createReply.mutationOptions(),
  );

  const handleSubmit = async () => {
    if (!value.trim()) return;
    await mutateAsync({ postId, content: value });
    setValue("");
    router.refresh();
  };

  return (
    <div className="space-y-3 border-t pt-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-input"
        placeholder="Write your reply..."
      />
      <div className="flex justify-end">
        {value.trim() && (
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Posting..." : "Post Reply"}
          </Button>
        )}
      </div>
    </div>
  );
}
