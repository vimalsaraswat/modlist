import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { authClient } from "~/utils/auth";

export default function ProfileScreen() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const logout = async () => {
    // Trigger logout mutation or clear session
    await authClient.signOut();
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-4">
      <Text className="mb-6 text-2xl font-bold text-foreground">Profile</Text>
      {session?.user ? (
        <View>
          <Text className="mb-2 text-lg text-foreground">
            Name: {session.user.name}
          </Text>
          <Text className="mb-6 text-lg text-foreground">
            Email: {session.user.email}
          </Text>
          <Pressable
            onPress={logout}
            className="rounded-lg bg-destructive px-6 py-3"
          >
            <Text className="text-center font-semibold text-white">Logout</Text>
          </Pressable>
        </View>
      ) : (
        <Text className="text-foreground">Not logged in</Text>
      )}
    </SafeAreaView>
  );
}
