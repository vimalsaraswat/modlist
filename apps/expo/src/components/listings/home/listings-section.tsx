import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

import type { ListingItem } from "~/types/listings";
import ListingCard, { SkeletonCard } from "./listing-card";

interface ListingsSectionProps {
  listings: ListingItem[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isRefetching: boolean;
  isFetchingNextPage: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
}

const ListingsSection = ({
  listings,
  isLoading,
  isError,
  isEmpty,
  isRefetching,
  isFetchingNextPage,
  onRefresh,
  onLoadMore,
  onRetry,
}: ListingsSectionProps) => {
  if (isLoading) {
    return (
      <FlatList
        data={Array(10).fill(null)}
        renderItem={() => <SkeletonCard />}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 16 }}
      />
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-2 text-xl font-bold text-foreground">
          Something went wrong
        </Text>
        <Text className="mb-6 text-center text-muted-foreground">
          We couldn't load the listings. Please check your connection or try
          again.
        </Text>
        <Pressable
          onPress={onRetry}
          className="rounded-lg bg-primary px-6 py-3"
        >
          <Text className="font-semibold text-primary-foreground">Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-xl font-bold text-foreground">
          No listings found
        </Text>
        <Text className="mt-2 text-muted-foreground">
          Be the first to list your car parts!
        </Text>
        <Pressable
          onPress={onRefresh}
          className="mt-4 rounded-lg bg-primary px-6 py-3"
        >
          <Text className="font-semibold text-primary-foreground">Refresh</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={listings}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ListingCard item={item} />}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          tintColor={"#1DA1F2"}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <ActivityIndicator size="small" color="#1DA1F2" />
          </View>
        ) : null
      }
    />
  );
};

export default ListingsSection;
