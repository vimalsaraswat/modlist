import { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import ListingCarousel from "~/components/listings/listing-carousel";
import ListingDetails from "~/components/listings/listing-details";
import ListingHeader from "~/components/listings/listing-header";
import ListingSellerInfo from "~/components/listings/listing-seller-info";
import { trpc } from "~/utils/api";

export default function ListingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const { data, isPending, error, refetch } = useQuery(
    trpc.listing.byId.queryOptions({
      id: id,
    }),
  );

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

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <ActivityIndicator size="large" color="#1DA1F2" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-5">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <Text className="mb-2 text-lg font-bold text-foreground">
          Error loading listing
        </Text>
        <Text className="text-primary underline" onPress={() => refetch()}>
          Retry
        </Text>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <Text className="text-lg font-bold text-foreground">
          Listing not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: data.title,
          headerShown: false,
        }}
      />

      <ListingHeader
        title={data.title}
        listingId={data.id}
        initialIsFavourited={data.isFavourite}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 2 }}
        showsVerticalScrollIndicator={false}
      >
        <ListingCarousel images={data.images} />
        <View className="px-4 pt-4">
          <ListingDetails
            title={data.title}
            price={data.price}
            description={data.description}
            make={data.make ?? ""}
            model={data.model ?? ""}
            category={data.category ?? ""}
            city={data.city ?? ""}
            createdAt={data.createdAt}
          />
          {data.user && (
            <ListingSellerInfo
              seller={data.user}
              sellerId={data.user.id}
              listing={{
                id: data.id,
                title: data.title,
                image: data.images[0] ?? "",
                description: data.description,
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
