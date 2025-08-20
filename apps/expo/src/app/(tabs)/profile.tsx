import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Button } from "~/components/ui/button";
import { trpc } from "~/utils/api";

export default function ProfileScreen() {
  const router = useRouter();

  // Fetch user profile, garage and favourites
  const { data: user, isLoading: userLoading } = useQuery(
    trpc.auth.getUserData.queryOptions(),
  );

  const { data: garage, isLoading: garageLoading } = useQuery(
    trpc.garage.myGarage.queryOptions(),
  );

  const { data: favourites, isLoading: favLoading } = useQuery(
    trpc.listing.favouritesList.queryOptions({}),
  );

  if (userLoading || garageLoading || favLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-lg text-foreground">You need to log in</Text>
        <Button className="mt-4" onPress={() => router.push("/auth/login")}>
          Login
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background pb-10">
      <ScrollView className="flex-1 bg-background">
        {/* User Info */}
        <View className="items-center bg-card p-6 shadow-sm">
          <Image
            source={{ uri: user.image ?? "https://placehold.co/100x100" }}
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
            <Button size="sm" onPress={() => router.push("/garage/add")}>
              <Text>Add Car</Text>
            </Button>
          </View>

          {garage?.length ? (
            garage.map((car) => (
              <Pressable
                key={car.id}
                className="mb-4 rounded-lg border border-border bg-card p-3 shadow-sm"
                onPress={() => router.push(`/garage/${car.id}`)}
              >
                {/* Car images */}
                {car.images?.length > 0 && (
                  <FlatList
                    horizontal
                    data={car.images}
                    keyExtractor={(url, idx) => `${car.id}-${idx}`}
                    renderItem={({ item: img }) => (
                      <Image
                        source={{ uri: img }}
                        className="mr-2 h-20 w-28 rounded-md"
                        resizeMode="cover"
                      />
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                )}

                <View className="mt-2">
                  <Text className="text-base font-semibold text-foreground">
                    {car.make} {car.model} ({car.year})
                  </Text>
                  {car.name && (
                    <Text className="text-sm text-muted-foreground">
                      “{car.name}”
                    </Text>
                  )}
                  {car.description && (
                    <Text className="mt-1 text-sm text-muted-foreground">
                      {car.description}
                    </Text>
                  )}
                </View>
              </Pressable>
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
            <Button size="sm" onPress={() => router.push("/favourites")}>
              <Text>See All</Text>
            </Button>
          </View>

          {favourites?.items?.length ? (
            favourites.items.map((listing) => (
              <Pressable
                key={listing.id}
                className="mb-4 flex-row items-center rounded-lg border border-border bg-card p-3 shadow-sm"
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/listings/[id]",
                    params: { id: listing.id },
                  })
                }
              >
                {listing.imageUrl && (
                  <Image
                    source={{ uri: listing.imageUrl }}
                    className="mr-3 h-16 w-16 rounded-md"
                    resizeMode="cover"
                  />
                )}
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
      </ScrollView>
    </SafeAreaView>
  );
}
