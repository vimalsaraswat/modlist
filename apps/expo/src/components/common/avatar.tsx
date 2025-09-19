import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { cn } from "~/lib/utils";
import { useThemeColors } from "~/styles/colors";
import { trpc } from "~/utils/api";
import ImageCarousel from "../image-carausal";

const sizeMap = {
  sm: {
    containerClass: "h-8 w-8",
    textClass: "text-base",
    iconSize: 20,
  },
  md: {
    containerClass: "h-10 w-10",
    textClass: "text-lg",
    iconSize: 24,
  },
  lg: {
    containerClass: "h-12 w-12",
    textClass: "text-xl",
    iconSize: 28,
  },
  xl: {
    containerClass: "h-14 w-14",
    textClass: "text-2xl",
    iconSize: 32,
  },
};

interface AvatarProps {
  image?: string | null;
  name?: string | null;
  userId?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Avatar = ({
  image,
  name,
  userId,
  size = "md",
  className,
}: AvatarProps) => {
  const colors = useThemeColors();
  const [modalVisible, setModalVisible] = useState(false);

  const { containerClass, textClass, iconSize } = sizeMap[size];

  const {
    data: garage,
    isLoading,
    isError,
  } = useQuery(
    trpc.garage.carsByUser.queryOptions(
      {
        userId: userId ?? "",
      },
      {
        enabled: modalVisible && !!userId,
      },
    ),
  );

  const handlePress = () => {
    if (userId) setModalVisible(true);
  };

  const renderCar = ({
    item,
  }: {
    item: {
      id: string;
      make: string | null;
      model: string | null;
      year: number;
      name: string | null;
      description: string | null;
      images: string[];
    };
  }) => (
    <View
      className="my-2 rounded-lg border p-3 shadow-sm"
      style={{ borderColor: colors.border, backgroundColor: colors.card }}
    >
      <Text
        className="text-lg font-medium"
        style={{ color: colors.cardForeground }}
      >
        {item.make ?? "Unknown Make"} {item.model ?? "Unknown Model"} (
        {item.year})
      </Text>
      {item.name && (
        <Text className="text-sm" style={{ color: colors.mutedForeground }}>
          {item.name}
        </Text>
      )}
      {item.description && (
        <Text
          className="mt-1 text-sm"
          style={{ color: colors.mutedForeground }}
        >
          {item.description}
        </Text>
      )}
      {item.images.length > 0 && (
        <View className="mt-2">
          <ImageCarousel images={item.images} />
        </View>
      )}
    </View>
  );

  return (
    <>
      <Pressable onPress={handlePress} disabled={!userId}>
        {image ? (
          <Image
            source={{ uri: image }}
            className={cn(`${containerClass} rounded-full`, className)}
          />
        ) : name?.trim() ? (
          <View
            className={cn(
              `${containerClass} items-center justify-center rounded-full`,
              className,
            )}
            style={{ backgroundColor: colors.primary }}
          >
            <Text
              className={`font-bold ${textClass}`}
              style={{ color: colors.primaryForeground }}
            >
              {name.trim().charAt(0).toUpperCase()}
            </Text>
          </View>
        ) : (
          <View
            className={cn(
              `${containerClass} items-center justify-center rounded-full`,
              className,
            )}
            style={{ backgroundColor: colors.secondary }}
          >
            <Ionicons
              name="person-circle-outline"
              size={iconSize}
              color={colors.secondaryForeground}
            />
          </View>
        )}
      </Pressable>

      {userId && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            className="flex-1 justify-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <View
              className="mx-4 h-[80%] rounded-lg p-4"
              style={{ backgroundColor: colors.popover }}
            >
              <View className="mb-4 flex-row items-center justify-between">
                <Text
                  className="text-xl font-bold"
                  style={{ color: colors.popoverForeground }}
                >
                  {name}’s Garage
                </Text>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={colors.popoverForeground}
                  />
                </Pressable>
              </View>

              {isLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              ) : isError ? (
                <Text
                  className="text-center text-sm"
                  style={{ color: colors.destructive }}
                >
                  Failed to load garage details.
                </Text>
              ) : garage && garage.length > 0 ? (
                <FlatList
                  data={garage}
                  renderItem={renderCar}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingBottom: 16 }}
                />
              ) : (
                <Text
                  className="text-center text-sm"
                  style={{ color: colors.mutedForeground }}
                >
                  No cars in garage.
                </Text>
              )}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default Avatar;
