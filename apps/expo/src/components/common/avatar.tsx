import { Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "~/styles/colors";

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
};

const Avatar = ({
  image,
  name,
  size = "md",
}: {
  image?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
}) => {
  const colors = useThemeColors();

  const { containerClass, textClass, iconSize } = sizeMap[size];

  return (
    <>
      {image ? (
        <Image
          source={{ uri: image }}
          className={`${containerClass} rounded-full`}
        />
      ) : name?.trim() ? (
        <View
          className={`${containerClass} items-center justify-center rounded-full bg-primary`}
        >
          <Text className={`font-bold text-primary-foreground ${textClass}`}>
            {name.trim().charAt(0).toUpperCase()}
          </Text>
        </View>
      ) : (
        <View
          className={`${containerClass} items-center justify-center rounded-full bg-secondary`}
        >
          <Ionicons
            name="person-circle-outline"
            size={iconSize}
            color={colors.secondaryForeground}
          />
        </View>
      )}
    </>
  );
};

export default Avatar;
