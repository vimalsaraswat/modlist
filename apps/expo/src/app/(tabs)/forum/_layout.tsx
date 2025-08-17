import { Stack } from "expo-router";

export default function ForumLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Forum", headerShown: false }}
      />
      <Stack.Screen
        name="category/[slug]"
        options={{ title: "Category Posts", headerShown: false }}
      />
      <Stack.Screen
        name="post/[postId]"
        options={{ title: "Post Details", headerShown: false }}
      />
      <Stack.Screen
        name="post/new"
        options={{ title: "Create Post", headerShown: false }}
      />
    </Stack>
  );
}
