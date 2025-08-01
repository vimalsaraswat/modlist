import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { Text } from "~/components/ui/text";
import { authClient } from "~/utils/auth";

// Keep the splash screen visible while we fetch resources
void SplashScreen.preventAutoHideAsync();

export default function App() {
  const { data: session, isPending } = authClient.useSession();

  // Effect to hide splash screen when session check is complete
  useEffect(() => {
    if (!isPending) {
      void SplashScreen.hideAsync();
    }
  }, [isPending]);

  if (isPending) {
    return null;
  }

  // If user is authenticated, don't show the landing page
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  // Show the landing page for unauthenticated users
  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
    </View>
  );
}

// components/HomeScreen.tsx (or wherever you keep this component)

function HomeScreen() {
  const handleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Hero Section */}

      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-12 items-center">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-2xl bg-primary">
            <Text className="text-3xl font-bold text-primary-foreground">
              M
            </Text>
          </View>
          <Text className="mb-2 text-center text-4xl font-bold text-foreground">
            Modlist
          </Text>
          <Text className="text-center text-lg text-muted-foreground">
            Discover, buy & sell automotive modifications
          </Text>
        </View>

        {/* Features */}
        <View className="mb-12 w-full">
          <View className="mb-4 flex-row items-center px-4">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-accent">
              <Text className="text-sm text-accent-foreground">🚗</Text>
            </View>
            <Text className="text-base text-foreground">
              Browse thousands of car parts and modifications
            </Text>
          </View>
          <View className="mb-4 flex-row items-center px-4">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-accent">
              <Text className="text-sm text-accent-foreground">💬</Text>
            </View>
            <Text className="text-base text-foreground">
              Chat directly with sellers and enthusiasts
            </Text>
          </View>
          <View className="mb-4 flex-row items-center px-4">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-accent">
              <Text className="text-sm text-accent-foreground">⭐</Text>
            </View>
            <Text className="text-base text-foreground">
              Save your favorite parts and builds
            </Text>
          </View>
        </View>

        {/* Sign In Button */}
        <Pressable
          onPress={handleSignIn}
          className="w-full flex-row items-center justify-center rounded-lg bg-primary p-4 active:opacity-90"
        >
          <View className="mr-3 h-6 w-6 items-center justify-center rounded bg-white">
            <Text className="text-xs font-bold text-primary">G</Text>
          </View>
          <Text className="text-base font-semibold text-primary-foreground">
            Continue with Google
          </Text>
        </Pressable>

        <Text className="mt-6 px-4 text-center text-sm text-muted-foreground">
          Join thousands of automotive enthusiasts sharing their builds and
          finding parts
        </Text>
      </View>
    </View>
  );
}
