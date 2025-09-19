import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

import { formatDateLabel, formatTime } from "@acme/helpers";

import type { Message, ProductMetadata } from "~/types/chats";
import Avatar from "~/components/common/avatar";
import BackButton from "~/components/common/back-btn";
import { useMediaUploader } from "~/hooks/useMediaUploader";
import { useThemeColors } from "~/styles/colors";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

const DateHeader = ({ date }: { date: Date }) => {
  const dateLabel = formatDateLabel(date);

  return (
    <View className="my-3 items-center">
      <View className="rounded-full bg-muted/80 px-3 py-1">
        <Text className="text-xs font-medium text-muted-foreground">
          {dateLabel}
        </Text>
      </View>
    </View>
  );
};

const ProductMessage = ({ metadata }: { metadata: ProductMetadata }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/listings/${metadata.listingId}`)}
      className="overflow-hidden rounded-lg border border-border bg-card"
    >
      <View className="flex flex-row items-center">
        <Image
          source={{ uri: metadata.image }}
          className="h-20 w-20"
          resizeMode="cover"
        />
        <View className="w-48 px-2">
          <Text
            className="text-sm font-semibold text-foreground"
            numberOfLines={1}
          >
            {metadata.title}
          </Text>
          <Text
            className="mt-[2px] text-xs text-muted-foreground"
            numberOfLines={3}
          >
            {metadata.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MessageBubble = ({
  message,
  isMe,
}: {
  message: Message;
  isMe: boolean;
}) => {
  const colors = useThemeColors();
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const showTime = (date: Date) => {
    try {
      return formatTime(date);
    } catch {
      return "";
    }
  };

  const renderContent = () => {
    switch (message.type) {
      case "product":
        try {
          const metadata = message.metadata as ProductMetadata;
          return <ProductMessage metadata={metadata} />;
        } catch {
          return (
            <Text
              className={clsx("text-sm", isMe ? "text-white" : "")}
              style={{
                color: isMe ? colors.primaryForeground : colors.foreground,
              }}
            >
              {message.text || "Product shared"}
            </Text>
          );
        }
      case "system":
        return (
          <Text
            className="text-center text-xs italic"
            style={{ color: colors.mutedForeground }}
          >
            {message.text}
          </Text>
        );
      case "media":
        return (
          <View className="rounded-lg">
            {message.metadata?.image ? (
              <View className="relative h-60 w-60">
                {isImageLoading && !imageError && (
                  <View className="absolute inset-0 flex items-center justify-center">
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                )}
                <Image
                  source={{ uri: message.metadata.image }}
                  className={clsx(
                    "h-60 w-60 rounded-lg",
                    imageError && "opacity-0",
                  )}
                  resizeMode="cover"
                  onLoadStart={() => {
                    setIsImageLoading(true);
                  }}
                  onLoadEnd={() => setIsImageLoading(false)}
                  onError={() => {
                    setIsImageLoading(false);
                    setImageError(true);
                  }}
                />
                {imageError && (
                  <View className="absolute inset-0 flex items-center justify-center">
                    <Ionicons
                      name="image-outline"
                      size={24}
                      color={colors.mutedForeground}
                    />
                    <Text
                      className="mt-1 text-xs"
                      style={{ color: colors.mutedForeground }}
                    >
                      Image failed to load
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View className="flex items-center">
                <Ionicons
                  name="image-outline"
                  size={24}
                  color={colors.mutedForeground}
                />
                <Text
                  className="mt-1 text-xs"
                  style={{ color: colors.mutedForeground }}
                >
                  No image available
                </Text>
              </View>
            )}
            {message.text && (
              <Text
                className="mt-1 text-sm"
                style={{
                  color: isMe ? colors.primaryForeground : colors.foreground,
                }}
              >
                {message.text}
              </Text>
            )}
          </View>
        );
      default:
        return (
          <Text
            className={clsx("text-sm", isMe ? "text-white" : "text-foreground")}
          >
            {message.text}
          </Text>
        );
    }
  };

  if (message.type === "system") {
    return <View className="my-2 items-center">{renderContent()}</View>;
  }

  return (
    <View
      className={clsx("mb-3 max-w-[85%]", isMe ? "self-end" : "self-start")}
    >
      <View
        className={clsx(
          "rounded-3xl px-4 py-2",
          isMe ? "rounded-br-md bg-primary/80" : "rounded-bl-md bg-muted",
        )}
      >
        {renderContent()}
        <Text
          className={clsx(
            "mt-1 self-end text-xs",
            isMe ? "text-secondary-foreground" : "text-muted-foreground",
          )}
        >
          {showTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
};

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: session } = authClient.useSession();
  const colors = useThemeColors();

  const router = useRouter();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [behaviour, setBehaviour] = useState<"padding" | undefined>("padding");

  const flatListRef = useRef<FlatList>(null);

  const {
    data: chatData,
    isLoading: chatLoading,
    isError: chatError,
  } = useQuery(trpc.chat.byId.queryOptions({ chatId: id }));

  const {
    data: messages = [],
    isLoading: messagesLoading,
    isError: messagesError,
    refetch: refetchMessages,
  } = useQuery(
    trpc.chat.getMessages.queryOptions(
      { chatId: id },
      {
        refetchInterval: 3000,
      },
    ),
  );

  const getPresignedUrl = useMutation(
    trpc.uploader.getPreSignedUrl.mutationOptions({
      onError: () => {
        Toast.show({ type: "error", text1: "Image upload failed" });
      },
    }),
  );

  const sendMessage = useMutation(
    trpc.chat.sendMessage.mutationOptions({
      onSuccess: async () => {
        setText("");
        removeAll();
        await queryClient.invalidateQueries(trpc.chat.getMessages.pathFilter());
      },
      onError: () => {
        Toast.show({
          type: "error",
          text1: "Message failed to send. Please try again.",
        });
      },
    }),
  );

  const {
    files,
    previews,
    isUploading,
    handleFileChange,
    removeFile,
    removeAll,
    uploadAll,
  } = useMediaUploader({
    maxFiles: 1,
    maxFileSizeMB: 2,
    allowedTypes: [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    getPresignedUrl: getPresignedUrl.mutateAsync,
  });

  const handleSend = async () => {
    if (!text.trim() && !files.length) return;
    if (sendMessage.isPending || isUploading) return;

    let mediaUrl: string | undefined;

    if (files.length) {
      try {
        const [url] = await uploadAll();
        mediaUrl = url;
      } catch (err) {
        console.log("\n\n\n\nerrrrrrrororrrrrrrr\n\n", err);
        Toast.show({
          type: "error",
          text1: "Image upload failed. Please try again.",
        });
        return;
      }
    }

    await sendMessage.mutateAsync({
      chatId: id,
      text: text.trim(),
      mediaUrl,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchMessages(),
      queryClient.invalidateQueries(trpc.chat.byId.pathFilter()),
    ]);
    setIsRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      setBehaviour("padding");
    });
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setBehaviour(undefined);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const groupedMessages = messages.reduce(
    (groups: Record<string, Message[]>, message) => {
      const dateKey = new Date(message.createdAt).toDateString();
      groups[dateKey] ??= [];
      groups[dateKey].push(message);
      return groups;
    },
    {},
  );

  const flattenedMessages = Object.entries(groupedMessages).flatMap(
    ([date, msgs]) => [{ type: "date-header", date: new Date(date) }, ...msgs],
  );

  useEffect(() => {
    if (flattenedMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [flattenedMessages.length]);

  if (chatLoading || messagesLoading) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (chatError || messagesError || !chatData) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View className="flex-1 items-center justify-center px-8">
          <View
            className="mb-6 h-24 w-24 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.destructive }}
          >
            <Ionicons
              name="warning-outline"
              size={40}
              color={colors.destructiveForeground}
            />
          </View>
          <Text
            className="mb-2 text-center text-xl font-bold"
            style={{ color: colors.foreground }}
          >
            Unable to Load Chat
          </Text>
          <Text
            className="mb-6 text-center"
            style={{ color: colors.mutedForeground }}
          >
            There was a problem loading this conversation. Please try again.
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleBack}
              className="rounded-lg px-6 py-3"
              style={{ backgroundColor: colors.muted }}
            >
              <Text
                className="font-semibold"
                style={{ color: colors.foreground }}
              >
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRefresh}
              className="rounded-lg px-6 py-3"
              style={{ backgroundColor: colors.primary }}
            >
              <Text
                className="font-semibold"
                style={{ color: colors.primaryForeground }}
              >
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const { participants } = chatData;
  const otherUser = participants.find(
    (p) => p.user?.email !== session?.user.email,
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <View
        className="flex-row items-center gap-2 border-b px-4 py-3"
        style={{ borderColor: colors.border }}
      >
        <BackButton />
        <View className="flex-1 flex-row items-center">
          <Avatar
            image={otherUser?.user?.image}
            name={otherUser?.user?.name}
            userId={otherUser?.user?.id}
          />
          <View className="ml-3">
            <Text
              className="font-semibold"
              style={{ color: colors.foreground }}
              numberOfLines={1}
            >
              {otherUser?.user?.name || "Unknown User"}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "android" ? behaviour : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={flattenedMessages}
          keyExtractor={(item, index) =>
            typeof item === "object" && "id" in item
              ? (item as Message).id
              : `date-${index}`
          }
          renderItem={({ item }) => {
            if ("date" in item) {
              return <DateHeader date={item.date} />;
            }
            const message = item as Message;
            const isMe = message.senderId === session?.user.id;
            return <MessageBubble message={message} isMe={isMe} />;
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input Area */}
        <View
          className="border-t px-4 py-3"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          {/* Image Preview */}
          {files.length > 0 && (
            <View className="relative mb-2 h-24 w-24">
              <Image
                source={{ uri: previews[0] }}
                className="h-full w-full rounded-md border"
                style={{ borderColor: colors.border }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => removeFile(0)}
                className="absolute -right-2 -top-2 rounded-full p-1"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                accessibilityLabel="Remove image"
              >
                <Ionicons
                  name="close"
                  size={16}
                  color={colors.primaryForeground}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Input Row */}
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleFileChange}
              disabled={isUploading || sendMessage.isPending}
              className="rounded-md p-2"
              style={{
                backgroundColor:
                  isUploading || sendMessage.isPending
                    ? colors.muted
                    : colors.background,
              }}
              accessibilityLabel="Attach image"
            >
              <Ionicons
                name="image"
                size={24}
                color={
                  isUploading || sendMessage.isPending
                    ? colors.mutedForeground
                    : colors.foreground
                }
              />
            </TouchableOpacity>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor={colors.mutedForeground}
              className="flex-1 rounded-2xl px-4 py-3 text-sm"
              style={{
                backgroundColor: colors.muted,
                color: colors.foreground,
              }}
              multiline
              numberOfLines={5}
              maxLength={1000}
              editable={!isUploading && !sendMessage.isPending}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={
                (!text.trim() && !files.length) ||
                sendMessage.isPending ||
                isUploading
              }
              className={clsx(
                "ml-2 h-10 w-10 items-center justify-center rounded-full",
                (text.trim() || files.length) &&
                  !sendMessage.isPending &&
                  !isUploading
                  ? "bg-primary"
                  : "bg-muted",
              )}
              style={{
                backgroundColor:
                  (text.trim() || files.length) &&
                  !sendMessage.isPending &&
                  !isUploading
                    ? colors.primary
                    : colors.muted,
              }}
            >
              {sendMessage.isPending || isUploading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primaryForeground}
                />
              ) : (
                <Ionicons
                  name="send"
                  size={20}
                  color={
                    text.trim() || files.length
                      ? colors.primaryForeground
                      : colors.mutedForeground
                  }
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
