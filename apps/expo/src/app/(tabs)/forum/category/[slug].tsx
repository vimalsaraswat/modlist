import React, { useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { formatDistanceToNow } from "@acme/helpers";

import { trpc } from "~/utils/api";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  replyCount: number;
  author: {
    name: string;
    avatar: string | null;
  } | null;
}

const PostCard = ({ post }: { post: Post }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/forum/post/${post.id}`)}
      className="mb-4 rounded-xl border border-border bg-card p-4 active:opacity-80"
    >
      <Text
        className="mb-2 text-base font-semibold text-foreground"
        numberOfLines={2}
      >
        {post.title}
      </Text>
      <Text className="mb-3 text-sm text-muted-foreground" numberOfLines={3}>
        {post.content}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {post.author?.avatar ? (
            <Image
              source={{ uri: post.author.avatar }}
              style={{ width: 24, height: 24, borderRadius: 12 }}
            />
          ) : (
            <View className="h-6 w-6 items-center justify-center rounded-full bg-muted">
              <Ionicons
                name="person-circle-outline"
                size={16}
                color="#9CA3AF"
              />
            </View>
          )}
          <Text className="ml-2 text-xs text-muted-foreground">
            {post.author?.name}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="chatbubble-outline" size={14} color="#9CA3AF" />
          <Text className="ml-1 text-xs text-muted-foreground">
            {post.replyCount}
          </Text>
        </View>
      </View>

      <Text className="mt-2 text-xs text-muted-foreground">
        {formatDistanceToNow(post.createdAt)}
      </Text>
    </TouchableOpacity>
  );
};

const SkeletonLoader = () => (
  <View className="mb-4 rounded-xl border border-border bg-card p-4">
    <View className="mb-3 h-5 w-3/4 rounded bg-muted" />
    <View className="mb-2 h-4 w-full rounded bg-muted" />
    <View className="mb-4 h-4 w-2/3 rounded bg-muted" />
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="mr-2 h-6 w-6 rounded-full bg-muted" />
        <View className="h-3 w-20 rounded bg-muted" />
      </View>
      <View className="flex-row items-center">
        <View className="mr-1 h-4 w-4 rounded-full bg-muted" />
        <View className="h-3 w-8 rounded bg-muted" />
      </View>
    </View>
  </View>
);

export default function ForumCategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: categories } = useQuery(trpc.forum.categoryList.queryOptions());

  const category = categories?.find((cat) => cat.slug === slug);

  const { data: posts = [], isLoading } = useQuery(
    trpc.forum.postsByCategory.queryOptions({ slug }),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries(trpc.forum.categoryList.pathFilter()),
      queryClient.invalidateQueries(trpc.forum.postsByCategory.pathFilter()),
    ]);
    setIsRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const renderSkeletons = () => (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonLoader key={i} />
      ))}
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-border px-4 pb-4 pt-2">
        <View className="mb-2 flex-row items-center">
          <TouchableOpacity onPress={handleBack} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#1DA1F2" />
          </TouchableOpacity>
          <Text
            className="flex-1 text-xl font-bold text-foreground"
            numberOfLines={1}
          >
            {category?.name ?? "Category"}
          </Text>
          <TouchableOpacity
            onPress={() => router.push(`/forum/post/new?category=${slug}`)}
            className="h-8 w-8 items-center justify-center rounded-full bg-primary"
          >
            <Ionicons name="add" size={18} color="white" />
          </TouchableOpacity>
        </View>
        {category?.description && (
          <Text className="text-sm text-muted-foreground">
            {category.description}
          </Text>
        )}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={
          isLoading ? (
            renderSkeletons()
          ) : posts.length === 0 ? (
            <View className="flex-1 items-center justify-center px-8 py-12">
              <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-muted">
                <Ionicons
                  name="document-text-outline"
                  size={40}
                  color="#9CA3AF"
                />
              </View>
              <Text className="mb-2 text-center text-xl font-bold text-foreground">
                No Posts Yet
              </Text>
              <Text className="mb-6 text-center text-muted-foreground">
                Be the first to start a discussion in this category
              </Text>
              <TouchableOpacity
                onPress={() => router.push(`/forum/post/new?category=${slug}`)}
                className="rounded-lg bg-primary px-6 py-3"
              >
                <Text className="font-semibold text-foreground">
                  Start Discussion
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
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
    </SafeAreaView>
  );
}
