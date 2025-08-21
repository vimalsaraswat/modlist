import React, { useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { formatCurrency } from "@acme/helpers";

import type { ListingItem } from "~/types/listings";

interface ListingCardProps {
  item: ListingItem;
}

const ListingCard = ({ item }: ListingCardProps) => {
  const router = useRouter();

  const formattedDate = useMemo(
    () =>
      new Date(item.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [item.createdAt],
  );

  const formattedPrice = useMemo(
    () => (item.price ? formatCurrency(item.price) : "N/A"),
    [item.price],
  );

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/listings/[id]",
          params: { id: item.id },
        })
      }
      className="mb-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm active:opacity-90"
    >
      <View>
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
          <View className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1">
            <Text className="text-xs font-semibold text-secondary-foreground">
              {item.category}
            </Text>
          </View>
        )}

        <View className="p-4">
          <Text
            className="mb-1 text-lg font-bold text-foreground"
            numberOfLines={2}
          >
            {item.title}
          </Text>

          {item.description && (
            <Text
              className="mb-3 text-sm text-muted-foreground"
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}

          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-extrabold text-accent">
              {formattedPrice}
            </Text>
            {item.city && (
              <Text className="text-sm text-muted-foreground">{item.city}</Text>
            )}
          </View>

          <View className="mt-2">
            <Text className="text-xs text-muted-foreground">
              {formattedDate}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export const SkeletonCard = () => (
  <View className="mb-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
    <View>
      <View className="h-48 w-full bg-secondary" />

      <View className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1" />

      <View className="p-4">
        <View className="mb-1 h-6 w-3/4 rounded-md bg-secondary" />

        <View className="mb-3 h-4 w-2/3 rounded-md bg-secondary" />

        <View className="flex-row items-center justify-between">
          <View className="h-6 w-1/4 rounded-md bg-secondary" />
          <View className="h-4 w-1/6 rounded-md bg-secondary" />
        </View>

        <View className="mt-2">
          <View className="h-4 w-1/3 rounded-md bg-secondary" />
        </View>
      </View>
    </View>
  </View>
);

export default ListingCard;
