import { Stack } from "expo-router";

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Chats", headerShown: false }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Chat Details", headerShown: false }}
      />
    </Stack>
  );
}
