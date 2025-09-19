import { useEffect } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { Redirect, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { authClient } from "~/utils/auth";

void SplashScreen.preventAutoHideAsync();

export default function App() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      void SplashScreen.hideAsync();
    }
  }, [isPending]);

  if (isPending) return null;
  if (session) {
    const user = session.user;

    const isProfileIncomplete =
      // !user.phoneNumber ||
      // !user.phoneNumberVerified ||
      !user.name || // you can add more fields as required
      !user.image;

    if (isProfileIncomplete) {
      return <Redirect href="/onboarding" />;
    }
    return <Redirect href="/(tabs)/listings" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        {/* Brand Logo */}
        <View className="mb-10 items-center">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Text className="text-3xl font-bold text-primary-foreground">
              M
            </Text>
          </View>
          <Text className="mb-2 text-center text-4xl font-extrabold text-foreground">
            Modlist
          </Text>
          <Text className="text-center text-lg text-muted-foreground">
            Discover, buy & sell automotive modifications
          </Text>
        </View>

        {/* Hero Illustration (optional) */}
        {/*<Image
          source={require("~/assets/")} // put a car/garage illustration
          className="mb-10 h-52 w-full"
          resizeMode="contain"
        />*/}

        {/* CTA */}
        <Pressable
          onPress={() => router.push("/sign-in")}
          className="w-full items-center justify-center rounded-xl bg-primary p-4 active:opacity-90"
        >
          <Text className="text-lg font-semibold text-primary-foreground">
            Get Started
          </Text>
        </Pressable>

        {/* Small footer */}
        <Text className="mt-6 px-6 text-center text-xs text-muted-foreground">
          Join thousands of automotive enthusiasts sharing their builds and
          finding parts
        </Text>
      </View>
    </SafeAreaView>
  );
}
