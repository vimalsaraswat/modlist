import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";

interface Category {
  id: number;
  name: string;
}

interface HeaderSectionProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  onFilterPress: () => void;
  selectedCategories: number[];
  minPrice: string;
  maxPrice: string;
  onClearFilters: () => void;
  categories: Category[];
  onRemoveCategory: (id: number) => void;
  onRemovePriceFilter: () => void;
}

const HeaderSection = ({
  searchText,
  onSearchChange,
  onFilterPress,
  selectedCategories,
  minPrice,
  maxPrice,
  onClearFilters,
  categories,
  onRemoveCategory,
  onRemovePriceFilter,
}: HeaderSectionProps) => {
  const router = useRouter();

  const handleCreateListing = () => {
    router.push("/(tabs)/listings/new");
  };

  return (
    <View className="border-b border-border bg-background px-4 py-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-extrabold text-foreground">
          Browse Parts
        </Text>
        <Pressable
          onPress={handleCreateListing}
          className="flex-row items-center rounded-lg bg-primary px-3 py-2"
        >
          <Ionicons name="add" size={18} color="white" />
          <Text className="ml-1 font-semibold text-primary-foreground">
            Create
          </Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View className="mt-4 flex-row items-center">
        <TextInput
          placeholder="Search listings..."
          value={searchText}
          onChangeText={onSearchChange}
          className="h-12 flex-1 rounded-l-xl border border-r-0 border-border bg-card px-4 text-foreground"
        />
        <Pressable
          onPress={onFilterPress}
          className="h-12 flex-row items-center justify-center rounded-r-xl border border-border bg-primary px-4"
        >
          <Ionicons name="filter" size={20} color="white" />
          {/*<Text className="ml-2 font-semibold text-primary-foreground">
            Filter
          </Text>*/}
        </Pressable>
      </View>

      {/* Active Filters */}
      {(selectedCategories.length > 0 || minPrice || maxPrice) && (
        <View className="mt-3 flex-row flex-wrap">
          {selectedCategories.map((catId) => {
            const category = categories.find((c) => c.id === catId);
            return (
              <View
                key={catId}
                className="mb-2 mr-2 flex-row items-center rounded-full bg-primary/10 px-3 py-1"
              >
                <Text className="text-xs text-primary">{category?.name}</Text>
                <Pressable
                  onPress={() => onRemoveCategory(catId)}
                  className="ml-1"
                >
                  <AntDesign name="close" size={12} color="#1DA1F2" />
                </Pressable>
              </View>
            );
          })}
          {(minPrice || maxPrice) && (
            <View className="mb-2 mr-2 flex-row items-center rounded-full bg-primary/10 px-3 py-1">
              <Text className="text-xs text-primary">
                ₹{minPrice || "0"} - ₹{maxPrice || "∞"}
              </Text>
              <Pressable onPress={onRemovePriceFilter} className="ml-1">
                <AntDesign name="close" size={12} color="#1DA1F2" />
              </Pressable>
            </View>
          )}
          <Pressable onPress={onClearFilters} className="mb-2">
            <Text className="text-xs text-muted-foreground underline">
              Clear all
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default HeaderSection;
