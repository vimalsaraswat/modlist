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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { formatDistanceToNow } from "@acme/helpers";

import { trpc } from "~/utils/api";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  postCount: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  replyCount: number;
  author: {
    name: string;
    image: string | null;
  } | null;
}

const CategoryCard = ({ category }: { category: Category }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/forum/category/${category.slug}`)}
      className="mb-4 rounded-xl border border-border bg-card p-4 active:opacity-80"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="mb-1 text-lg font-semibold text-foreground">
            {category.name}
          </Text>
          <Text
            className="mb-2 text-sm text-muted-foreground"
            numberOfLines={2}
          >
            {category.description}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="document-text-outline" size={14} color="#9CA3AF" />
            <Text className="ml-1 text-xs text-muted-foreground">
              {category.postCount} posts
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

const TrendingPostCard = ({ post }: { post: Post }) => {
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
          {post.author?.image ? (
            <Image
              source={{ uri: post.author.image }}
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
        <Text className="text-xs text-muted-foreground">
          {formatDistanceToNow(post.createdAt)}
        </Text>
      </View>

      <View className="mt-2 flex-row items-center">
        <Ionicons name="chatbubble-outline" size={14} color="#9CA3AF" />
        <Text className="ml-1 text-xs text-muted-foreground">
          {post.replyCount} replies
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const SkeletonLoader = () => (
  <View className="mb-4 rounded-xl border border-border bg-card p-4">
    <View className="mb-3 h-5 w-3/4 rounded bg-muted" />
    <View className="mb-2 h-4 w-full rounded bg-muted" />
    <View className="mb-4 h-4 w-2/3 rounded bg-muted" />
    <View className="flex-row items-center">
      <View className="mr-2 h-6 w-6 rounded-full bg-muted" />
      <View className="h-3 w-20 rounded bg-muted" />
    </View>
  </View>
);

const EmptyState = () => (
  <View className="flex-1 items-center justify-center px-8 py-12">
    <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-muted">
      <Ionicons name="chatbubbles-outline" size={40} color="#9CA3AF" />
    </View>
    <Text className="mb-2 text-center text-xl font-bold text-foreground">
      No Forum Content
    </Text>
    <Text className="text-center text-muted-foreground">
      Check back later for discussions and community posts
    </Text>
  </View>
);

export default function ForumHomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery(
    trpc.forum.categoryList.queryOptions(),
  );

  const { data: trending = [], isLoading: trendingLoading } = useQuery(
    trpc.forum.trendingPosts.queryOptions(),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries(trpc.forum.categoryList.pathFilter()),
      queryClient.invalidateQueries(trpc.forum.trendingPosts.pathFilter()),
    ]);
    setIsRefreshing(false);
  };

  const renderCategorySkeletons = () => (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonLoader key={`cat-${i}`} />
      ))}
    </>
  );

  const renderTrendingSkeletons = () => (
    <>
      {Array.from({ length: 2 }).map((_, i) => (
        <SkeletonLoader key={`trend-${i}`} />
      ))}
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-border px-4 pb-4 pt-2">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">
            Community Forum
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/forum/post/new")}
            className="h-10 w-10 items-center justify-center rounded-full bg-primary"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-muted-foreground">
          Join discussions with fellow modders
        </Text>
      </View>

      <FlatList
        data={[]}
        ListHeaderComponent={
          <>
            {/* Trending Section */}
            <View className="px-4 pt-4">
              <View className="mb-4 flex-row items-center">
                <Ionicons name="flame" size={20} color="#F59E0B" />
                <Text className="ml-2 text-lg font-semibold text-foreground">
                  Trending Discussions
                </Text>
              </View>

              {trendingLoading ? (
                renderTrendingSkeletons()
              ) : trending.length > 0 ? (
                trending.map((post) => (
                  <TrendingPostCard key={post.id} post={post} />
                ))
              ) : (
                <View className="mb-4 items-center rounded-xl border border-border bg-card p-6">
                  <Text className="text-muted-foreground">
                    No trending posts yet
                  </Text>
                </View>
              )}
            </View>

            {/* Categories Section */}
            <View className="px-4 pt-2">
              <Text className="mb-4 text-lg font-semibold text-foreground">
                Browse Categories
              </Text>

              {categoriesLoading ? (
                renderCategorySkeletons()
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))
              ) : (
                <EmptyState />
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
        renderItem={() => <></>}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
