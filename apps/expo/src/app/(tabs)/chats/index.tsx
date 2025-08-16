import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import ChatItem, { ChatItemSkeleton } from "~/components/chats/chat-list-item";
import { useThemeColors } from "~/styles/colors";
import { trpc } from "~/utils/api";

const EmptyState = () => (
  <View className="flex-1 items-center justify-center px-8">
    <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-muted">
      <Ionicons name="chatbubbles-outline" size={40} color="#9CA3AF" />
    </View>
    <Text className="mb-2 text-center text-xl font-bold text-foreground">
      No Conversations Yet
    </Text>
    <Text className="mb-6 text-center text-muted-foreground">
      Start chatting with sellers and buyers to see conversations here
    </Text>
  </View>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <View className="flex-1 items-center justify-center px-8">
    <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
      <Ionicons name="warning-outline" size={40} color="#EF4444" />
    </View>
    <Text className="mb-2 text-center text-xl font-bold text-foreground">
      Something Went Wrong
    </Text>
    <Text className="mb-6 text-center text-muted-foreground">
      We couldn't load your conversations. Please try again.
    </Text>
    <TouchableOpacity
      onPress={onRetry}
      className="rounded-lg bg-primary px-6 py-3"
    >
      <Text className="font-semibold text-foreground">Retry</Text>
    </TouchableOpacity>
  </View>
);

export default function ChatsScreen() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const colors = useThemeColors();

  const {
    data: chats = [],
    isPending,
    isError,
    refetch,
  } = useQuery(trpc.chat.myChats.queryOptions());

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const participant = chat.participantUser;
    const searchText = searchQuery.toLowerCase();
    return (
      participant?.name?.toLowerCase().includes(searchText) ||
      participant?.email?.toLowerCase().includes(searchText) ||
      chat?.lastMessage?.text?.toLowerCase().includes(searchText)
    );
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleRetry = useCallback(async () => {
    await queryClient.invalidateQueries(trpc.chat.myChats.pathFilter());
  }, [queryClient]);

  // Render empty state
  const renderEmptyState = () => {
    if (searchQuery && filteredChats.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="mb-2 text-lg font-semibold text-foreground">
            No chats found
          </Text>
          <Text className="text-center text-muted-foreground">
            Try adjusting your search terms
          </Text>
        </View>
      );
    }
    return <EmptyState />;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-border px-4 pb-3 pt-2">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">Messages</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center rounded-lg bg-muted/50 px-3">
          <Ionicons name="search" size={20} color={colors.mutedForeground} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search conversations..."
            className="ml-2 flex-1 text-foreground"
            placeholderTextColor={colors.mutedForeground}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {isPending ? (
        <FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={() => (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <ChatItemSkeleton key={i} />
              ))}
            </>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : isError ? (
        <ErrorState onRetry={handleRetry} />
      ) : filteredChats.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatItem chat={item} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.border}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </SafeAreaView>
  );
}
