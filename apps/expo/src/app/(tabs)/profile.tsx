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
import ProfileHeader from "~/components/profile/profile-header";
import { Button } from "~/components/ui/button";
import { trpc } from "~/utils/api";

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Queries
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery(trpc.auth.getUserProfile.queryOptions());
  const {
    data: listings,
    isLoading: listingsLoading,
    isError: listingsError,
  } = useQuery(trpc.auth.getUserListings.queryOptions({ limit: 5 }));
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
        queryClient.invalidateQueries(trpc.auth.getUserProfile.queryFilter()),
        queryClient.invalidateQueries(trpc.auth.getUserListings.queryFilter()),
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
  if (userLoading || listingsLoading || garageLoading || favLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Error state
  if (userError || listingsError || garageError || favError) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="mb-3 text-lg font-semibold text-destructive">
          Failed to load profile
        </Text>
        <Button onPress={handleRefresh}>Try Again</Button>
      </View>
    );
  }

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
          <View className="gap-2 p-2">
            {/* User Info */}
            <ProfileHeader user={user} />

            {/* My Listings */}
            <Section
              title="Your Listings"
              actionLabel="See All"
              onAction={() => router.push("/listings/my-listings")}
            >
              {listings?.length ? (
                listings.slice(0, 3).map((listing) => (
                  <Pressable
                    key={listing.id}
                    className="mb-3 flex-row items-center rounded-lg border border-border bg-card p-3 shadow-sm"
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
                          listing.imageUrl ??
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
                  You haven’t posted any listings yet
                </Text>
              )}
            </Section>

            {/* Garage */}
            <Section
              title="My Garage"
              actionLabel="Add Car"
              onAction={() => router.push("/garage/new")}
            >
              {garage?.length ? (
                garage.slice(0, 3).map((car) => (
                  <View
                    key={car.id}
                    className="mb-4 rounded-lg border border-border bg-card p-3 shadow-sm"
                  >
                    <ImageCarousel images={car.images} height={140} />
                    <View className="mt-2">
                      <Text className="text-base font-semibold text-foreground">
                        {car.make} {car.model} ({car.year})
                      </Text>
                      {car.name && (
                        <Text
                          className="text-md font-medium text-muted-foreground"
                          numberOfLines={1}
                        >
                          {car.name}
                        </Text>
                      )}
                      {car.description && (
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
            </Section>

            {/* Favourites */}
            <Section
              title="Favourites"
              actionLabel="See All"
              onAction={() => router.push("/listings/favourites")}
            >
              {favourites?.items.length ? (
                favourites.items.slice(0, 3).map((listing) => (
                  <Pressable
                    key={listing.id}
                    className="mb-3 flex-row items-center rounded-lg border border-border bg-card p-3 shadow-sm"
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
                          listing.imageUrl ??
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
            </Section>
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

// Reusable section wrapper
function Section({
  title,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View className="rounded-lg bg-card p-4 shadow-sm">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        {actionLabel && onAction && (
          <Button size="sm" onPress={onAction}>
            <Text>{actionLabel}</Text>
          </Button>
        )}
      </View>
      {children}
    </View>
  );
}

// import React, { useCallback, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   RefreshControl,
//   Text,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// import FavouritesSection from "~/components/profile/favourites-section";
// import MyGarageSection from "~/components/profile/my-garage-section";
// import MyListingsSection from "~/components/profile/my-listings-section";
// import ProfileHeader from "~/components/profile/profile-header";
// import { Button } from "~/components/ui/button";
// import { trpc } from "~/utils/api";

// export default function ProfileScreen() {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const [refreshing, setRefreshing] = useState(false);

//   // Queries
//   const {
//     data: user,
//     isLoading: userLoading,
//     isError: userError,
//   } = useQuery(trpc.auth.getUserProfile.queryOptions());
//   const {
//     data: listings,
//     isLoading: listingsLoading,
//     isError: listingsError,
//   } = useQuery(trpc.auth.getUserListings.queryOptions({ limit: 5 }));
//   const {
//     data: garage,
//     isLoading: garageLoading,
//     isError: garageError,
//   } = useQuery(trpc.garage.myGarage.queryOptions());
//   const {
//     data: favourites,
//     isLoading: favLoading,
//     isError: favError,
//   } = useQuery(trpc.listing.favouritesList.queryOptions({}));

//   const handleRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       await Promise.all([
//         queryClient.invalidateQueries(trpc.auth.getUserProfile.queryFilter()),
//         queryClient.invalidateQueries(trpc.auth.getUserListings.queryFilter()),
//         queryClient.invalidateQueries(trpc.garage.myGarage.queryFilter()),
//         queryClient.invalidateQueries(
//           trpc.listing.favouritesList.queryFilter(),
//         ),
//       ]);
//     } finally {
//       setRefreshing(false);
//     }
//   }, [queryClient]);

//   // Loading & Error States
//   if (userLoading || listingsLoading || garageLoading || favLoading) {
//     // Implement skeleton loading here for a better UX
//     return (
//       <View className="flex-1 items-center justify-center bg-background">
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (userError || listingsError || garageError || favError || !user) {
//     return (
//       <View className="flex-1 items-center justify-center bg-background p-6">
//         <Text className="text-lg font-semibold text-destructive">
//           Failed to load profile. Please log in again.
//         </Text>
//         <Button className="mt-4" onPress={() => router.push("/")}>
//           Login
//         </Button>
//       </View>
//     );
//   }

//   const sections = [
//     { key: "header", component: <ProfileHeader user={user} /> },
//     { key: "listings", component: <MyListingsSection listings={listings} /> },
//     { key: "garage", component: <MyGarageSection garage={garage} /> },
//     {
//       key: "favourites",
//       component: <FavouritesSection favourites={favourites?.items ?? []} />,
//     },
//   ];

//   return (
//     <SafeAreaView className="flex-1 bg-background">
//       <FlatList
//         data={sections}
//         renderItem={({ item }) => <View className="p-2">{item.component}</View>}
//         keyExtractor={(item) => item.key}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//         }
//       />
//     </SafeAreaView>
//   );
// }
