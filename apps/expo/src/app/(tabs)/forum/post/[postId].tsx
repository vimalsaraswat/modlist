import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

import { formatDistanceToNow } from "@acme/helpers";

import type { Post, Reply } from "~/types/forum";
import Avatar from "~/components/common/avatar";
import Header from "~/components/listings/new/header";
import { trpc } from "~/utils/api";

const PostHeader = ({ post }: { post: Post }) => (
  <View className="mb-4">
    <View className="flex-row items-center">
      <Avatar image={post.author?.avatar} name={post.author?.name} />

      <View className="ml-3">
        <Text className="font-semibold text-foreground">
          {post.author?.name}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-xs text-muted-foreground">
            {formatDistanceToNow(post.createdAt)}
          </Text>
          <Text className="mx-1 text-xs text-muted-foreground">•</Text>
          <View className="flex-row items-center">
            <Ionicons name="eye" size={12} color="#9CA3AF" />
            <Text className="ml-1 text-xs text-muted-foreground">
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
              }).format(post.viewCount)}{" "}
              {post.viewCount === 1 ? "view" : "views"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const PostContent = ({ content }: { content: string }) => (
  <View className="mb-6 rounded-xl border border-border bg-card p-4">
    <Text className="leading-relaxed text-foreground">{content}</Text>
  </View>
);

const ReplyItem = ({ reply }: { reply: Reply }) => (
  <View className="mb-4 rounded-xl border border-border bg-card p-4">
    <View className="mb-2 flex-row items-center">
      <Avatar
        image={reply.author?.avatar}
        name={reply.author?.name}
        size="sm"
      />

      <View className="ml-2">
        <Text className="text-sm font-medium text-foreground">
          {reply.author?.name}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {formatDistanceToNow(reply.createdAt)}
        </Text>
      </View>
    </View>

    <Text className="text-sm leading-relaxed text-foreground">
      {reply.content}
    </Text>
  </View>
);

const ReplyForm = ({ postId }: { postId: string }) => {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const createReply = useMutation(
    trpc.forum.createReply.mutationOptions({
      onSuccess: async () => {
        setText("");
        await queryClient.invalidateQueries(trpc.forum.postById.pathFilter());
      },
      onError: (error) => {
        Alert.alert("Error", "Failed to post reply. Please try again.");
        console.error("Reply error:", error);
      },
    }),
  );

  const handleSubmit = () => {
    if (text.trim() && !createReply.isPending) {
      createReply.mutate({ postId, content: text.trim() });
    }
  };

  return (
    <View className="border-t border-border bg-background p-4">
      <View className="flex-row items-center">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Write a reply..."
          className="mr-2 flex-1 rounded-full bg-muted px-4 py-3 text-foreground"
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!text.trim() || createReply.isPending}
          className={clsx(
            "h-10 w-10 items-center justify-center rounded-full",
            text.trim() && !createReply.isPending ? "bg-primary" : "bg-muted",
          )}
        >
          {createReply.isPending ? (
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
  );
};

export default function ForumPostScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [behaviour, setBehaviour] = useState<"padding" | undefined>("padding");

  const { data: postData, isLoading } = useQuery(
    trpc.forum.postById.queryOptions(
      { postId },
      {
        staleTime: 60 * 1000,
      },
    ),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries(trpc.forum.postById.pathFilter());
    setIsRefreshing(false);
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header title="Discussion" />

        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1DA1F2" />
        </View>
      </SafeAreaView>
    );
  }

  if (!postData) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header title="Discussion" />

        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
            <Ionicons name="warning-outline" size={40} color="#EF4444" />
          </View>
          <Text className="mb-2 text-center text-xl font-bold text-foreground">
            Post Not Found
          </Text>
          <Text className="mb-6 text-center text-muted-foreground">
            This discussion could not be found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const { post, replies } = postData;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <Header title={post.title} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "android" ? behaviour : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={replies}
          keyExtractor={(item: Reply) => item.id}
          renderItem={({ item }) => <ReplyItem reply={item} />}
          ListHeaderComponent={
            <>
              <View className="pt-2">
                <PostHeader post={post} />
                <PostContent content={post.content} />
              </View>

              <View className="px-4 pb-2">
                <Text className="mb-1 text-lg font-semibold text-foreground">
                  Replies ({replies.length})
                </Text>

                {replies.length === 0 && (
                  <View className="mb-4 items-center rounded-xl border border-border bg-card p-6">
                    <Text className="text-muted-foreground">
                      No replies yet. Be the first to respond!
                    </Text>
                  </View>
                )}
              </View>
            </>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#1DA1F2"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        />

        <ReplyForm postId={postId} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
