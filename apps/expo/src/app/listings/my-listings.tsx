import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { formatDate } from "@acme/helpers";

import Header from "~/components/listings/new/header";
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

const LIMIT = 20;

const MyListingsScreen = () => {
  const router = useRouter();

  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const {
    data,
    isPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.listing.myListingsList.infiniteQueryOptions(
      { limit: LIMIT },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      },
    ),
  );

  // Flatten pages into a single array
  const listings: ListingItem[] =
    data?.pages.flatMap((page) => page.items) ?? [];

  const handlePullToRefresh = async () => {
    setIsRefetching(true);
    await refetch();
    await queryClient.invalidateQueries(trpc.listing.byId.queryFilter());
    setIsRefetching(false);
  };

  const loadMore = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending && !isRefetching) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header title="Your Listings" />

        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1DA1F2" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    console.log("error", error);
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header title="Your Listings" />

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

  if (listings.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header title="Your Listings" />

        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-2xl font-bold text-foreground">
            No listings found
          </Text>
          <Text className="mb-6 text-center text-muted-foreground">
            Create a listing and it will show up here.
          </Text>
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/(tabs)/listings/new",
              });
            }}
            className="rounded-lg bg-primary px-6 py-3"
          >
            <Text className="font-semibold text-primary-foreground">
              List your parts
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Your Listings" />

      <FlatList
        data={listings}
        keyExtractor={(item, index) => `${item.id.toString()}-${index}`}
        renderItem={({ item }) => <ListingCard item={item} />}
        contentContainerStyle={{ padding: 16 }}
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
    </SafeAreaView>
  );
};

const ListingCard = ({ item }: { item: ListingItem }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/listings/[id]",
          params: { id: item.id },
        });
      }}
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
              {item.price
                ? new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(item.price)
                : "N/A"}
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

export default MyListingsScreen;
