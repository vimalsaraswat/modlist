import React, { useCallback, useState } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";

import ImageCarousel from "~/components/image-carausal";
import { Button } from "~/components/ui/button";
import { trpc } from "~/utils/api";

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);

  // Fetch user profile, garage and favourites
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery(trpc.auth.getUserData.queryOptions());

  const {
    data: garage,
    isLoading: garageLoading,
    isError: garageError,
  } = useQuery(trpc.garage.myGarage.queryOptions());

  const {
    data: favourites,
    isLoading: favLoading,
    isError: favError,
  } = useQuery(trpc.listing.favouritesList.queryOptions({}));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries(trpc.auth.getUserData.queryFilter()),
        queryClient.invalidateQueries(trpc.garage.myGarage.queryFilter()),
        queryClient.invalidateQueries(
          trpc.listing.favouritesList.queryFilter(),
        ),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  // Loading state
  if (userLoading || garageLoading || favLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Error state
  if (userError || garageError || favError) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="mb-3 text-lg font-semibold text-destructive">
          Failed to load profile
        </Text>
        <Button onPress={handleRefresh}>Try Again</Button>
      </View>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-lg text-foreground">You need to log in</Text>
        <Button className="mt-4" onPress={() => router.push("/")}>
          Login
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background pb-10">
      <FlatList
        ListHeaderComponent={
          <View>
            {/* User Info */}
            <View className="items-center bg-card p-6 shadow-sm">
              <Image
                source={{
                  uri: user.image || "https://placehold.co/100x100?text=User",
                }}
                className="h-20 w-20 rounded-full"
              />
              <Text className="mt-3 text-xl font-bold text-foreground">
                {user.name}
              </Text>
              <Text className="text-muted-foreground">{user.email}</Text>
              <Text className="mt-1 text-sm text-muted-foreground">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>

            {/* Garage Section */}
            <View className="mt-6 bg-card p-4 shadow-sm">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-foreground">
                  My Garage
                </Text>
                <Button size="sm" onPress={() => router.push("/garage/new")}>
                  <Text>Add Car</Text>
                </Button>
              </View>

              {garage?.length ? (
                garage.map((car) => (
                  <View
                    key={car.id}
                    className="mb-4 rounded-lg border border-border bg-card p-3 shadow-sm"
                  >
                    <ImageCarousel images={car?.images} height={140} />

                    <View className="mt-2">
                      <Text className="text-base font-semibold text-foreground">
                        {car?.make} {car?.model} ({car?.year})
                      </Text>
                      {car?.name && (
                        <Text
                          className="text-md font-medium text-muted-foreground"
                          numberOfLines={1}
                        >
                          {car.name}
                        </Text>
                      )}
                      {car?.description && (
                        <Text
                          className="mt-1 text-sm text-muted-foreground"
                          numberOfLines={2}
                        >
                          {car.description}
                        </Text>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <Text className="text-muted-foreground">
                  No cars in your garage yet
                </Text>
              )}
            </View>

            {/* Favourites Section */}
            <View className="mt-6 bg-card p-4 shadow-sm">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-foreground">
                  Favourites
                </Text>
                <Button
                  size="sm"
                  onPress={() => router.push("/listings/favourites")}
                >
                  <Text>See All</Text>
                </Button>
              </View>

              {favourites?.items?.length ? (
                favourites.items.slice(0, 3).map((listing) => (
                  <Pressable
                    key={listing.id}
                    className="mb-4 flex-row items-center rounded-lg border border-border bg-card p-3 shadow-sm"
                    onPress={() =>
                      router.push({
                        pathname: "/listings/[id]",
                        params: { id: listing.id },
                      })
                    }
                  >
                    <Image
                      source={{
                        uri:
                          listing.imageUrl ||
                          "https://placehold.co/100x100?text=Item",
                      }}
                      className="mr-3 h-16 w-16 rounded-md"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {listing.title}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        ₹{listing.price} · {listing.city}
                      </Text>
                    </View>
                  </Pressable>
                ))
              ) : (
                <Text className="text-muted-foreground">
                  No favourite listings yet
                </Text>
              )}
            </View>
          </View>
        }
        data={[]} // FlatList requires data
        renderItem={null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
}
