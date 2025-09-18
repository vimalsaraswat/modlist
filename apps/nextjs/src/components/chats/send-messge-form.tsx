"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Paperclip, SendIcon, X } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/toast";

import { useMediaUploader } from "~/hooks/useMediaUploader";
import { useTRPC } from "~/trpc/react";

interface Props {
  chatId: string;
}

export default function SendMessageForm({ chatId }: Props) {
  const [text, setText] = useState("");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  /**
   * Mutation to get pre-signed URL for uploads
   */
  const getPresignedUrl = useMutation(
    trpc.uploader.getPreSignedUrl.mutationOptions({
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to send messages"
            : "Image upload failed. Please try again.",
        );
      },
    }),
  );

  /**
   * Media uploader hook for image uploads
   */
  const {
    uploadAll,
    isUploading,
    removeAll,
    files,
    removeFile,
    handleFileChange,
    previews,
  } = useMediaUploader({
    maxFiles: 1,
    getPresignedUrl: getPresignedUrl.mutateAsync,
  });

  /**
   * Mutation for sending a chat message
   */
  const { mutateAsync, isPending } = useMutation(
    trpc.chat.sendMessage.mutationOptions({
      onSuccess: async () => {
        setText("");
        removeAll();
        await queryClient.invalidateQueries(trpc.chat.getMessages.pathFilter());
      },
      onError: () => {
        toast.error("Message failed to send. Please try again.");
      },
    }),
  );

  /**
   * Form submission handler
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !files.length) return;

    let fileUrl: string | undefined;

    if (files.length) {
      try {
        const [url] = await uploadAll();
        fileUrl = url;
      } catch {
        toast.error("Image upload failed. Please try again.");
        return;
      }
    }

    await mutateAsync({
      chatId,
      text: text.trim(),
      mediaUrl: fileUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t p-2">
      {/* Image preview */}
      {files.length > 0 && (
        <div className="relative h-24 w-24">
          <img
            src={previews[0]}
            alt="Preview"
            className="h-full w-full rounded-md border object-cover"
          />
          <button
            type="button"
            onClick={() => removeFile(0)}
            className="absolute -right-2 -top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        {/* Attach Image */}
        <label className="cursor-pointer rounded-md p-2 transition-colors hover:bg-muted">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Paperclip className="h-5 w-5" />
        </label>

        {/* Message Input */}
        <Input
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isPending || isUploading}
          className="flex-1"
        />

        {/* Send Button */}
        <Button
          type="submit"
          disabled={isPending || isUploading || (!text.trim() && !files.length)}
          size="icon"
        >
          {isPending || isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
}
