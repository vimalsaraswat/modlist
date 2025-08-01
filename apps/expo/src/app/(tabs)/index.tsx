import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "@rn-primitives/slot";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { trpc } from "~/utils/api";

interface ListingItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  makeId: number;
  modelId: number;
  category: string | null;
  city: string | null;
  latitude: string | null;
  longitude: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
}

const HomeScreen = () => {
  const [isRefetching, setIsRefetching] = useState(false);
  const [offset, setOffset] = useState(0);
  const queryClient = useQueryClient();

  const LIMIT = 20;

  const {
    data: listings,
    isLoading,
    error,
    refetch: refetchListings,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    trpc.listing.list.queryOptions({
      limit: LIMIT,
      offset: offset,
    }),
    {}
  );

  const handlePullToRefresh = async () => {
    setIsRefetching(true);
    setOffset(0);
    await refetchListings();
    setIsRefetching(false);
  };

  const loadMore = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      const newOffset = offset + LIMIT;
      setOffset(newOffset);
      fetchNextPage();
    }
  }, [offset, isFetchingNextPage, hasNextPage, fetchNextPage]);

  if (isLoading && !isRefetching) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1DA1F2" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-2xl font-bold text-foreground">
            Error loading listings
          </Text>
          <Text className="mb-6 text-center text-muted-foreground">
            Something went wrong. Please try again.
          </Text>
          <Pressable
            onPress={handlePullToRefresh}
            className="rounded-lg bg-primary px-6 py-3"
          >
            <Text className="font-semibold text-primary-foreground">Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Empty state
  if (!listings || listings.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-2xl font-bold text-foreground">
            No listings found
          </Text>
          <Text className="mb-6 text-center text-muted-foreground">
            Be the first to list your car parts!
          </Text>
          <Pressable
            onPress={handlePullToRefresh}
            className="rounded-lg bg-primary px-6 py-3"
          >
            <Text className="font-semibold text-primary-foreground">
              Refresh
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <Text className="text-xl font-bold text-foreground">Browse Parts</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handlePullToRefresh}
            tintColor={"#1DA1F2"}
          />
        }
      >
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ListingCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handlePullToRefresh}
              tintColor={"#1DA1F2"}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#1DA1F2" />
              </View>
            ) : null
          }
        />
        {/*<FlatList
          data={listings}
          className="px-2"
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ListingCard item={item} />}
        />*/}
      </ScrollView>
    </SafeAreaView>
  );
};

const ListingCard = ({ item }: { item: ListingItem }) => {
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Pressable
      onPress={() => console.log(`/listing/${item.id}`)}
      className="mb-4 overflow-hidden rounded-lg border border-border bg-card active:opacity-90"
    >
      <View>
        {/* Image section */}
        <View className="relative">
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              className="h-48 w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-48 w-full items-center justify-center bg-secondary">
              <Text className="text-secondary-foreground">No Image</Text>
            </View>
          )}
          {item.category && (
            <View className="absolute left-2 top-2 rounded-full bg-secondary px-3 py-1">
              <Text className="text-xs font-medium text-secondary-foreground">
                {item.category}
              </Text>
            </View>
          )}
        </View>

        {/* Content section */}
        <View className="p-4">
          <Text className="mb-2 font-bold text-foreground" numberOfLines={2}>
            {item.title}
          </Text>

          {item.description && (
            <Text
              className="mb-4 text-sm text-muted-foreground"
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}

          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-accent">
              ${item.price?.toLocaleString() || "N/A"}
            </Text>
            {item.city && (
              <View className="flex-row items-center">
                {/*<MapPin size={14} color="#9CA3AF" />*/}
                <Text className="ml-1 text-sm text-muted-foreground">
                  {item.city}
                </Text>
              </View>
            )}
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              {/*<Clock size={14} color="#9CA3AF" />*/}
              <Text className="ml-1 text-sm text-muted-foreground">
                {formatDate(item.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default HomeScreen;
