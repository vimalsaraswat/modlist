import Toast from "react-native-toast-message";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { queryClient } from "~/utils/api";

import "../styles.css";

import { QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar />
      </QueryClientProvider>
      <Toast />
    </>
  );
}
