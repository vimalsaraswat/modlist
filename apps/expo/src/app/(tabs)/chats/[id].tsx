import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

import { formatDateLabel, formatTime } from "@acme/helpers";

import type { Message, ProductMetadata } from "~/types/chats";
import Avatar from "~/components/common/avatar";
import BackButton from "~/components/common/back-btn";
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
              className={clsx(
                "text-sm",
                isMe ? "text-white" : "text-foreground",
              )}
            >
              {message.text || "Product shared"}
            </Text>
          );
        }
      case "system":
        return (
          <Text className="text-center text-xs italic text-muted-foreground">
            {message.text}
          </Text>
        );
      case "media":
        return (
          <View className="rounded-lg bg-muted p-3">
            <Ionicons name="image-outline" size={24} color="#9CA3AF" />
            <Text className="mt-1 text-xs text-muted-foreground">Media</Text>
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

  const navigation = useNavigation();

  const router = useRouter();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const sendMessage = useMutation(
    trpc.chat.sendMessage.mutationOptions({
      onSuccess: async () => {
        setText("");
        await queryClient.invalidateQueries(trpc.chat.getMessages.pathFilter());
      },
      onError: (error) => {
        Alert.alert("Error", "Failed to send message. Please try again.");
        console.error("Send message error:", error);
      },
    }),
  );

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

  const handleSend = () => {
    if (text.trim() && !sendMessage.isPending) {
      sendMessage.mutate({ chatId: id, text: text.trim() });
    }
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
    if (flattenedMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [flattenedMessages.length]);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: "flex",
        },
      });
    };
  }, []);

  if (chatLoading || messagesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1DA1F2" />
        </View>
      </SafeAreaView>
    );
  }

  if (chatError || messagesError || !chatData) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
            <Ionicons name="warning-outline" size={40} color="#EF4444" />
          </View>
          <Text className="mb-2 text-center text-xl font-bold text-foreground">
            Unable to Load Chat
          </Text>
          <Text className="mb-6 text-center text-muted-foreground">
            There was a problem loading this conversation. Please try again.
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleBack}
              className="rounded-lg bg-muted px-6 py-3"
            >
              <Text className="font-semibold text-foreground">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRefresh}
              className="rounded-lg bg-primary px-6 py-3"
            >
              <Text className="font-semibold text-foreground">Retry</Text>
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
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <BackButton />

        <View className="flex-1 flex-row items-center">
          <Avatar image={otherUser?.user?.image} name={otherUser?.user?.name} />

          <View className="ml-3">
            <Text className="font-semibold text-foreground" numberOfLines={1}>
              {otherUser?.user?.name || "Unknown User"}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView className="flex-1" behavior="padding">
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
              tintColor="#1DA1F2"
            />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input Area */}
        <View className="border-t border-border bg-background px-4 py-3">
          <View className="flex-row items-center">
            {/*<TouchableOpacity className="mr-2">
              <Ionicons name="add" size={24} color="#9CA3AF" />
            </TouchableOpacity>*/}

            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              className="flex-1 rounded-2xl bg-muted px-4 py-3 text-foreground"
              multiline
              numberOfLines={5}
              maxLength={1000}
            />

            <TouchableOpacity
              onPress={handleSend}
              disabled={!text.trim() || sendMessage.isPending}
              className={clsx(
                "ml-2 h-10 w-10 items-center justify-center rounded-full",
                text.trim() && !sendMessage.isPending
                  ? "bg-primary"
                  : "bg-muted",
              )}
            >
              {sendMessage.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons
                  name="send"
                  size={20}
                  color={text.trim() ? "white" : "#9CA3AF"}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
