"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";

import { Button } from "@acme/ui/button";

import { useTRPC } from "~/trpc/react";

interface MessageSellerButtonProps {
  sellerId: string;
}

const MessageSellerButton = ({ sellerId }: MessageSellerButtonProps) => {
  const trpc = useTRPC();
  const router = useRouter();

  const { mutate, isPending } = useMutation(
    trpc.chat.create.mutationOptions({
      onSuccess: (data) => {
        if (data?.id) {
          router.push("/chats/" + data.id);
        }
      },
      onError: (_err, _, _context) => {
        // Error handling logic if needed
      },
    }),
  );

  const handleMessageSeller = () => {
    mutate({ userId: sellerId });
  };

  return (
    <Button
      className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
      onClick={handleMessageSeller}
      disabled={isPending}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Contact Seller
    </Button>
  );
};

export default MessageSellerButton;
