import { useCallback } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { formatDistanceToNow } from "@acme/helpers";

import type { ChatRow } from "~/types/chats";
import { cn } from "~/lib/utils";

const ChatItem = ({ chat }: { chat: ChatRow }) => {
  const router = useRouter();
  const participant = chat.participantUser;
  const lastMessage = chat.lastMessage;

  const getPreviewText = useCallback(() => {
    if (!lastMessage) return "No messages yet";
    if (lastMessage.type === "system") return "System message";
    return lastMessage.text ?? "Media message";
  }, [lastMessage]);

  const getTimeAgo = useCallback(() => {
    if (!lastMessage?.createdAt) return "";
    try {
      return formatDistanceToNow(new Date(lastMessage.createdAt), {
        addSuffix: true,
      });
    } catch {
      return "";
    }
  }, [lastMessage?.createdAt]);

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(tabs)/chats/[id]",
          params: { id: chat.id },
        })
      }
      className="flex-row items-center border-b border-border p-4 active:bg-muted/50"
    >
      <View className="relative">
        {participant?.image ? (
          <Image
            source={{ uri: participant.image }}
            className="h-12 w-12 rounded-full"
          />
        ) : (
          <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Ionicons name="person" size={24} color="#9CA3AF" />
          </View>
        )}
        {/* Online indicator */}
        {/*<View className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />*/}
      </View>

      <View className="ml-3 flex-1">
        <View className="flex-row items-center justify-between">
          <Text
            className={cn(
              "font-semibold text-foreground",
              !lastMessage && "text-muted-foreground",
            )}
            numberOfLines={1}
          >
            {participant?.name ?? participant?.email ?? "Unknown User"}
          </Text>
          {lastMessage?.createdAt && (
            <Text className="ml-2 text-xs text-muted-foreground">
              {getTimeAgo()}
            </Text>
          )}
        </View>
        <Text
          className={cn(
            "mt-1 text-sm",
            lastMessage ? "text-muted-foreground" : "text-muted-foreground/70",
          )}
          numberOfLines={1}
        >
          {getPreviewText()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const ChatItemSkeleton = () => (
  <View className="flex-row items-center border-b border-border p-4">
    <View className="h-12 w-12 rounded-full bg-muted" />
    <View className="ml-3 flex-1">
      <View className="mb-2 h-4 w-32 rounded bg-muted" />
      <View className="h-3 w-24 rounded bg-muted" />
    </View>
    <View className="h-3 w-16 rounded bg-muted" />
  </View>
);

export default ChatItem;
