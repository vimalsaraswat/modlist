import React from "react";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { formatCurrency } from "@acme/helpers";

interface ListingDetailsProps {
  title: string;
  price: number;
  description: string;
  make: string;
  model: string;
  category: string;
  city: string;
  createdAt: Date;
}

const ListingDetails = ({
  title,
  price,
  description,
  make,
  model,
  category,
  city,
  createdAt,
}: ListingDetailsProps) => {
  return (
    <View>
      {/* Price */}
      <View className="mb-6 border-b border-border py-4">
        <Text className="text-4xl font-bold text-primary">
          {formatCurrency(price)}
        </Text>
      </View>

      {/* Badges */}
      <View className="mb-4 flex-row">
        <View className="mr-2 rounded-full bg-primary px-3 py-1.5">
          <Text className="text-xs font-semibold text-primary-foreground">
            {category}
          </Text>
        </View>
      </View>

      {/* Meta Info */}
      <View className="mb-6 flex-row flex-wrap">
        <View className="mb-2 mr-4 flex-row items-center">
          <Feather name="map-pin" size={16} color="#94a3b8" />
          <Text className="ml-1 text-sm text-muted-foreground">{city}</Text>
        </View>
        <View className="mb-2 flex-row items-center">
          <Feather name="calendar" size={16} color="#94a3b8" />
          <Text className="ml-1 text-sm text-muted-foreground">
            <Text className="ml-1 text-sm text-muted-foreground">
              {new Date(createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </Text>
        </View>
      </View>

      {/* Description */}
      <View className="mb-6">
        <Text
          className="mb-4 mr-2 flex-1 text-xl font-bold text-foreground"
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text className="mb-2 text-sm font-bold text-foreground">
          Description
        </Text>
        <Text
          className="text-base leading-6 text-foreground"
          numberOfLines={20}
        >
          {description}
        </Text>
      </View>

      {/* Technical Specifications */}
      <View className="mb-6">
        <Text className="mb-3 text-xl font-bold text-foreground">
          Technical Specifications
        </Text>
        <View className="rounded-xl border border-border bg-card p-4">
          <View className="flex-row justify-between border-b border-muted py-3">
            <Text className="text-base text-muted-foreground">Make</Text>
            <Text className="text-base font-medium text-foreground">
              {make}
            </Text>
          </View>
          <View className="flex-row justify-between border-b border-muted py-3">
            <Text className="text-base text-muted-foreground">Model</Text>
            <Text className="text-base font-medium text-foreground">
              {model}
            </Text>
          </View>
          <View className="flex-row justify-between border-b border-muted py-3">
            <Text className="text-base text-muted-foreground">Category</Text>
            <Text className="text-base font-medium text-foreground">
              {category}
            </Text>
          </View>
          <View className="flex-row justify-between py-3">
            <Text className="text-base text-muted-foreground">Location</Text>
            <Text className="text-base font-medium text-foreground">
              {city}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ListingDetails;
