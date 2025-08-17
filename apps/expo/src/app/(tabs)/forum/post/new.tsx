import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

import { useThemeColors } from "~/styles/colors";
import { trpc } from "~/utils/api";

export default function NewPostScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { category: categorySlug } = useLocalSearchParams<{
    category?: string;
  }>();

  const colors = useThemeColors();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categorySlug?.trim() ? categorySlug.trim() : null,
  );

  const { data: categories = [] } = useQuery(
    trpc.forum.categoryList.queryOptions(),
  );

  const createPost = useMutation(
    trpc.forum.createPost.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.forum.categoryList.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.forum.trendingPosts.pathFilter(),
        );
        if (data?.id) {
          router.replace(`/forum/post/${data.id}`);
        }
      },
      onError: (error) => {
        Alert.alert("Error", "Failed to create post. Please try again.");
        console.error("Create post error:", error);
      },
    }),
  );

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !selectedCategory) {
      Toast.show({
        type: "info",
        text1: "Missing Information",
        text2: "Please fill in all required fields",
      });
      return;
    }

    if (title.trim().length < 5) {
      Toast.show({
        type: "info",
        text1: "Invalid Title",
        text2: "Title must be at least 5 characters",
      });
      return;
    }

    if (content.trim().length < 10) {
      Toast.show({
        type: "info",
        text1: "Invalid Content",
        text2: "Content must be at least 10 characters",
      });
      return;
    }

    const category = categories.find((c) => c.slug === selectedCategory);
    if (!category) {
      Toast.show({
        type: "error",
        text1: "Invalid Category",
        text2: "The selected category is not valid.",
      });
      return;
    }

    createPost.mutate({
      title: title.trim(),
      content: content.trim(),
      categoryId: category.id,
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-border px-4 pb-3 pt-2">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="close" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">
            New Discussion
          </Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text
              className={clsx(
                "font-semibold",
                createPost.isPending ||
                  !title.trim() ||
                  !content.trim() ||
                  !selectedCategory
                  ? "text-muted-foreground"
                  : "text-primary",
              )}
            >
              {createPost.isPending ? "Posting..." : "Post"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView className="flex-1 px-4 pt-4">
          {/* Category Selection */}
          <View className="mb-6">
            <Text className="mb-3 text-base font-semibold text-foreground">
              Category
            </Text>
            <View className="flex-row flex-wrap">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.slug)}
                  className={clsx(
                    "mb-2 mr-2 rounded-full border px-4 py-2",
                    selectedCategory === category.slug
                      ? "border-primary bg-primary"
                      : "border-border bg-muted",
                  )}
                >
                  <Text
                    className={clsx(
                      "text-sm",
                      selectedCategory === category.slug
                        ? "text-primary-foreground"
                        : "text-foreground",
                    )}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title Input */}
          <View className="mb-6">
            <Text className="mb-3 text-base font-semibold text-foreground">
              Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What would you like to discuss?"
              className="rounded-xl bg-muted px-4 py-3 text-foreground"
              maxLength={100}
            />
            <Text className="mt-1 text-right text-xs text-muted-foreground">
              {title.length}/100
            </Text>
          </View>

          {/* Content Input */}
          <View>
            <Text className="mb-3 text-base font-semibold text-foreground">
              Content
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Write your thoughts, questions, or experience here..."
              className="min-h-[200px] rounded-xl bg-muted px-4 py-3 text-foreground"
              multiline
              textAlignVertical="top"
              maxLength={2000}
              numberOfLines={12}
            />
            <Text className="mt-1 text-right text-xs text-muted-foreground">
              {content.length}/2000
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
