"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";

import { Button } from "@acme/ui/button";

import { useTRPC } from "~/trpc/react";

interface MessageSellerButtonProps {
  sellerId: string;
  listing: {
    id: string;
    title: string;
    image: string; // must be a URL
    description: string;
  };
}

const MessageSellerButton = ({
  sellerId,
  listing,
}: MessageSellerButtonProps) => {
  const trpc = useTRPC();
  const router = useRouter();

  const createChat = useMutation(
    trpc.chat.create.mutationOptions({
      onSuccess: async (data) => {
        if (!data?.id) return;

        // After creating the chat, send product message
        await sendProductMessage.mutateAsync({
          chatId: data.id,
          listingId: listing.id,
          title: listing.title,
          image: listing.image,
          description:
            listing.description.length > 250
              ? listing.description.slice(0, 247) + "..."
              : listing.description,
        });

        router.push("/chats/" + data.id);
      },
    }),
  );

  const sendProductMessage = useMutation(
    trpc.chat.sendProductMessage.mutationOptions(),
  );

  const handleClick = () => {
    createChat.mutate({ userId: sellerId });
  };

  return (
    <Button
      className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
      onClick={handleClick}
      disabled={createChat.isPending || sendProductMessage.isPending}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Contact Seller
    </Button>
  );
};

export default MessageSellerButton;
