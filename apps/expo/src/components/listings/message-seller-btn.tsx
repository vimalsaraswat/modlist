import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";

import { trpc } from "~/utils/api";

interface MessageSellerButtonProps {
  sellerId: string;
  listing: {
    id: string;
    title: string;
    image: string;
    description: string;
  };
}

const MessageSellerButton = ({
  sellerId,
  listing,
}: MessageSellerButtonProps) => {
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

        // router.push(`/chats/${data.id}`);
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: "Failed to start conversation",
          text2: error.message,
        });
      },
    }),
  );

  const sendProductMessage = useMutation(
    trpc.chat.sendProductMessage.mutationOptions(),
  );

  const handleClick = () => {
    // createChat.mutate({ userId: sellerId });
    Toast.show({
      type: "info",
      text1: "Coming Soon!",
      text2: "This feature is not yet available.",
    });
  };

  return (
    <TouchableOpacity
      className="flex-row items-center justify-center rounded-lg bg-primary px-4 py-3"
      onPress={handleClick}
      disabled={createChat.isPending || sendProductMessage.isPending}
    >
      <Feather name="message-circle" size={20} color="white" />
      <Text className="ml-2 font-semibold text-white">
        {createChat.isPending || sendProductMessage.isPending
          ? "Starting conversation..."
          : "Contact Seller"}
      </Text>
    </TouchableOpacity>
  );
};

export default MessageSellerButton;
