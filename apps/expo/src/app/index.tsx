import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { authClient } from "~/utils/auth";

void SplashScreen.preventAutoHideAsync();

export default function App() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      void SplashScreen.hideAsync();
    }
  }, [isPending]);

  if (isPending) {
    return null;
  }

  if (session) {
    return <Redirect href="/(tabs)/listings" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
    </View>
  );
}

function HomeScreen() {
  const [signInLoading, setSignInLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setSignInLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setSignInLoading(false);
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
          disabled={signInLoading}
          className={`w-full flex-row items-center justify-center rounded-lg bg-primary p-4 ${signInLoading ? "opacity-70" : "active:opacity-90"}`}
        >
          {signInLoading ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text className="ml-2 text-base font-semibold text-primary-foreground">
                Signing In...
              </Text>
            </>
          ) : (
            <>
              <View className="mr-3 h-6 w-6 items-center justify-center rounded bg-white">
                <Text className="text-xs font-bold text-primary">G</Text>
              </View>
              <Text className="text-base font-semibold text-primary-foreground">
                Continue with Google
              </Text>
            </>
          )}
        </Pressable>

        <Text className="mt-6 px-4 text-center text-sm text-muted-foreground">
          Join thousands of automotive enthusiasts sharing their builds and
          finding parts
        </Text>
      </View>
    </View>
  );
}
