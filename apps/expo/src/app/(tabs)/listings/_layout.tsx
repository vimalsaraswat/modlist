import { Stack } from "expo-router";

export default function ListingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Browse Parts", headerShown: false }}
      />
      <Stack.Screen name="[id]" options={{ title: "Listing Details" }} />
    </Stack>
  );
}
