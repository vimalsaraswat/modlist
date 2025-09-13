import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { formatDate } from "@acme/helpers";

import { useThemeColors } from "~/styles/colors";
import SignOut from "../auth/sign-out";
import Avatar from "../common/avatar";

export default function ProfileHeader({
  user,
}: {
  user: {
    city: string;
    bio: string | null;
    id: string;
    name: string | null;
    image: string | null;
    email: string;
    createdAt: Date;
    cityId: number | null;
    phoneNumber?: string | null;
    phoneNumberVerified?: boolean | null;
  };
}) {
  const theme = useThemeColors();

  return (
    <View className="rounded-2xl border border-border bg-card/80 p-4 shadow-md">
      {/* Top: Avatar + Name */}
      <View className="flex-row items-start gap-4">
        <Avatar image={user.image} name={user.name} size="lg" />
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl font-semibold text-foreground">
              {user.name}
            </Text>
            {user.phoneNumberVerified && (
              <View className="flex-row items-center rounded-full bg-muted px-2 py-0.5">
                <Ionicons
                  name="shield-checkmark"
                  color={theme.mutedForeground}
                  size={14}
                />
                <Text className="ml-1 text-xs text-muted-foreground">
                  Verified
                </Text>
              </View>
            )}
          </View>
          {user.bio ? (
            <Text
              className="mt-1 text-xs text-muted-foreground"
              numberOfLines={2}
            >
              {user.bio}
            </Text>
          ) : null}
        </View>
        {/*<TouchableOpacity
          onPress={logout}
          className="flex-row items-center justify-center rounded-lg bg-destructive/10 p-3"
        >
          <Ionicons
            name="log-out-outline"
            size={14}
            color={theme.destructive}
          />
          <Text className="ml-1 text-xs font-semibold text-destructive">
            Logout
          </Text>*
        </TouchableOpacity>*/}
        <SignOut />
      </View>

      {/* Meta info */}
      <View className="mt-3 flex-row flex-wrap gap-x-4 gap-y-1">
        <View className="flex-row items-center">
          <Ionicons name="mail" color={theme.mutedForeground} size={14} />
          <Text className="ml-1 text-xs text-muted-foreground">
            {user.email}
          </Text>
        </View>
        {user.city && (
          <View className="flex-row items-center">
            <Ionicons name="map" color={theme.mutedForeground} size={14} />
            <Text className="ml-1 text-xs text-muted-foreground">
              {user.city}
            </Text>
          </View>
        )}
        <View className="flex-row items-center">
          <Ionicons name="time" color={theme.mutedForeground} size={14} />
          <Text className="ml-1 text-xs text-muted-foreground">
            Joined {formatDate(user.createdAt)}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="mt-4 flex-row justify-end gap-2">
        {/*<ProfileEditDialog user={user} />
        <SignOutButton />*/}
        {/*<TouchableOpacity
          onPress={logout}
          className="flex-row items-center justify-center rounded-lg bg-destructive/10 p-3"
        >
          <Ionicons
            name="log-out-outline"
            size={14}
            color={theme.destructive}
          />
        </TouchableOpacity>*/}
      </View>
    </View>
  );
}
