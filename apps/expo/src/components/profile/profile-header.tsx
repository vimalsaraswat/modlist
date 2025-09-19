import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { formatDate } from "@acme/helpers";

import { useThemeColors } from "~/styles/colors";
import SignOut from "../auth/sign-out";
import Avatar from "../common/avatar";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    bio: string | null;
    image: string | null;
    city: string | null;
    createdAt: Date;
    phoneNumber: string | null;
    phoneNumberVerified: boolean | null;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const theme = useThemeColors();

  return (
    <View className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <View className="flex-row items-start">
        <View className="flex-1 flex-row items-start gap-4">
          <Avatar
            image={user.image}
            name={user.name}
            size="lg"
            className="rounded-2xl"
          />
          <View className="flex-1">
            {/* Name and Verification Badge */}
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-bold text-foreground">
                {user.name}
              </Text>
            </View>

            {/* User Bio */}
            {user.bio && (
              <Text
                className="mt-1 text-sm text-muted-foreground"
                numberOfLines={2}
              >
                {user.bio}
              </Text>
            )}
          </View>
        </View>

        {/* Edit Profile Action Button */}
        <SignOut />
      </View>

      {/* Divider */}
      <View className="my-4 h-px bg-border" />

      <View className="gap-3">
        {/* Email */}
        <View className="flex-row items-center gap-3">
          <Ionicons
            name="mail-outline"
            color={theme.mutedForeground}
            size={16}
          />
          <View className="flex-row items-center gap-1.5">
            <Text className="text-sm text-muted-foreground">{user.email}</Text>
            {/* Email Verified Badge */}
            {/*<Ionicons name="shield-checkmark" color={theme.primary} size={16} />*/}
          </View>
        </View>

        {user.phoneNumber && (
          <View className="flex-row items-center gap-3">
            <Ionicons
              name="call-outline"
              color={theme.mutedForeground}
              size={16}
            />
            <View className="flex-row items-center gap-1.5">
              <Text className="text-sm text-muted-foreground">
                {user.phoneNumber}
              </Text>
              {/* Phone Verified Badge */}
              {/*{user.phoneNumberVerified && (
                <Ionicons
                  name="shield-checkmark"
                  color={theme.primary}
                  size={16}
                />
              )}*/}
            </View>
          </View>
        )}

        {/* Location */}
        {/*{user.city && (
          <View className="flex-row items-center gap-3">
            <Ionicons
              name="map-outline"
              color={theme.mutedForeground}
              size={16}
            />
            <Text className="text-sm text-muted-foreground">{user.city}</Text>
          </View>
        )}*/}

        {/* Join Date */}
        <View className="flex-row items-center gap-3">
          <Ionicons
            name="calendar-outline"
            color={theme.mutedForeground}
            size={16}
          />
          <Text className="text-sm text-muted-foreground">
            Joined {formatDate(user.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );
}
