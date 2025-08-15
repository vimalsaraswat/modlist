import React, { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import type { Category, City, Make } from "~/types/listings";
import { trpc } from "~/utils/api";

const ICON_SIZE = 14;
const ITEM_SIZE = "h-5 w-5";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View className="mb-6">
    <Text className="mb-3 px-4 text-lg font-bold text-foreground">{title}</Text>
    <ScrollView
      nestedScrollEnabled
      className="max-h-60 rounded-lg border border-border/50 bg-card/30"
    >
      {children}
    </ScrollView>
  </View>
);

interface SelectItemProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  type: "multi" | "single";
}

const SelectItem: React.FC<SelectItemProps> = ({
  label,
  isSelected,
  onSelect,
  disabled = false,
  type,
}) => (
  <Pressable
    onPress={onSelect}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={`Select ${label}`}
    className={`flex-row items-center px-4 py-3 ${disabled ? "opacity-50" : "active:opacity-80"} ${
      isSelected ? "bg-primary/15" : "bg-transparent"
    }`}
  >
    <View className={`mr-3 ${ITEM_SIZE} items-center justify-center`}>
      <View
        className={`${ITEM_SIZE} items-center justify-center rounded-full border ${
          isSelected ? "border-primary bg-primary" : "border-border"
        }`}
      >
        {isSelected && (
          <Ionicons
            name={type === "multi" ? "checkmark" : "radio-button-on"}
            size={ICON_SIZE}
            color="white"
          />
        )}
      </View>
    </View>
    <Text
      className={`flex-1 ${isSelected ? "font-semibold text-primary" : "text-foreground"}`}
      numberOfLines={1}
    >
      {label}
    </Text>
  </Pressable>
);

interface FilterModalProps {
  categories: Category[];
  makes: Make[];
  cities: City[];
  selectedCategoryIds: number[];
  selectedMakeId: number | null;
  selectedModelId: number | null;
  selectedCityIds: number[];
  minPrice: string;
  maxPrice: string;
  onClose: () => void;
  onApply: (filters: {
    categoryIds: number[];
    makeId: number | null;
    modelId: number | null;
    cityIds: number[];
    minPrice: string;
    maxPrice: string;
  }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  categories,
  makes,
  cities,
  selectedCategoryIds,
  selectedMakeId,
  selectedModelId,
  selectedCityIds,
  minPrice,
  maxPrice,
  onClose,
  onApply,
}) => {
  const [tempCategoryIds, setTempCategoryIds] =
    useState<number[]>(selectedCategoryIds);
  const [tempMakeId, setTempMakeId] = useState<number | null>(selectedMakeId);
  const [tempModelId, setTempModelId] = useState<number | null>(
    selectedModelId,
  );
  const [tempCityIds, setTempCityIds] = useState<number[]>(selectedCityIds);
  const [tempMinPrice, setTempMinPrice] = useState<string>(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState<string>(maxPrice);

  const { data: models = [], isPending: modelsLoading } = useQuery(
    trpc.listing.modelListByMake.queryOptions(
      { makeId: tempMakeId ?? -1 },
      { enabled: tempMakeId !== null },
    ),
  );
  // Sync with prop changes
  useEffect(
    () => setTempCategoryIds(selectedCategoryIds),
    [selectedCategoryIds],
  );
  useEffect(() => setTempMakeId(selectedMakeId), [selectedMakeId]);
  useEffect(() => setTempModelId(selectedModelId), [selectedModelId]);
  useEffect(() => setTempCityIds(selectedCityIds), [selectedCityIds]);
  useEffect(() => setTempMinPrice(minPrice), [minPrice]);
  useEffect(() => setTempMaxPrice(maxPrice), [maxPrice]);

  // Toggle handlers
  const toggleCategory = useCallback(
    (id: number) =>
      setTempCategoryIds(() => {
        // prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        return [id];
      }),
    [],
  );

  const toggleCity = useCallback(
    (id: number) =>
      setTempCityIds(() => {
        // prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        return [id];
      }),
    [],
  );

  const selectMake = useCallback(
    (id: number | null) => {
      setTempMakeId(id);
      if (id !== selectedMakeId) setTempModelId(null);
    },
    [selectedMakeId],
  );

  const handleApply = useCallback(() => {
    onApply({
      categoryIds: tempCategoryIds,
      makeId: tempMakeId,
      modelId: tempModelId,
      cityIds: tempCityIds,
      minPrice: tempMinPrice,
      maxPrice: tempMaxPrice,
    });
    onClose();
  }, [
    onApply,
    onClose,
    tempCategoryIds,
    tempMakeId,
    tempModelId,
    tempCityIds,
    tempMinPrice,
    tempMaxPrice,
  ]);

  const clearAll = useCallback(() => {
    setTempCategoryIds([]);
    setTempMakeId(null);
    setTempModelId(null);
    setTempCityIds([]);
    setTempMinPrice("");
    setTempMaxPrice("");
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="border-b border-border bg-card px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={onClose}
            className="p-2"
            accessibilityLabel="Close filters"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color="#9CA3AF" />
          </Pressable>
          <Text className="text-lg font-bold text-foreground">Filters</Text>
          <Pressable onPress={handleApply} className="px-2 py-1">
            <Text className="font-semibold text-primary">Apply</Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Price Range */}
        <Section title="Price Range">
          <View className="flex-row items-center px-4 py-3">
            <View className="flex-1">
              <Text className="mb-1 text-xs text-muted-foreground">
                Min Price
              </Text>
              <TextInput
                placeholder="0"
                value={tempMinPrice}
                onChangeText={(val) =>
                  setTempMinPrice(val.replace(/[^0-9]/g, ""))
                }
                keyboardType="numeric"
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </View>
            <Text className="mx-3 text-foreground">-</Text>
            <View className="flex-1">
              <Text className="mb-1 text-xs text-muted-foreground">
                Max Price
              </Text>
              <TextInput
                placeholder="Any"
                value={tempMaxPrice}
                onChangeText={(val) =>
                  setTempMaxPrice(val.replace(/[^0-9]/g, ""))
                }
                keyboardType="numeric"
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </View>
          </View>
        </Section>

        {/* Categories */}
        <Section title="Categories">
          <SelectItem
            label="All Categories"
            type="multi"
            isSelected={tempCategoryIds.length === 0}
            onSelect={() => setTempCategoryIds([])}
          />
          {categories.length > 0 ? (
            categories.map((cat) => (
              <SelectItem
                key={cat.id}
                label={cat.name}
                type="multi"
                isSelected={tempCategoryIds.includes(cat.id)}
                onSelect={() => toggleCategory(cat.id)}
              />
            ))
          ) : (
            <Text className="px-4 py-3 text-center text-muted-foreground">
              No categories available
            </Text>
          )}
        </Section>

        {/* Makes */}
        <Section title="Makes">
          <SelectItem
            label="All Makes"
            type="single"
            isSelected={tempMakeId === null}
            onSelect={() => selectMake(null)}
          />
          {makes.length > 0 ? (
            makes.map((make) => (
              <SelectItem
                key={make.id}
                label={make.name}
                type="single"
                isSelected={tempMakeId === make.id}
                onSelect={() => selectMake(make.id)}
              />
            ))
          ) : (
            <Text className="px-4 py-3 text-center text-muted-foreground">
              No makes available
            </Text>
          )}
        </Section>

        {/* Models */}
        <Section title="Models">
          <SelectItem
            label="All Models"
            type="single"
            isSelected={tempModelId === null}
            onSelect={() => setTempModelId(null)}
            disabled={tempMakeId === null}
          />
          {tempMakeId === null ? (
            <Text className="px-4 py-3 text-center text-muted-foreground">
              Select a Make first
            </Text>
          ) : modelsLoading ? (
            <Text className="px-4 py-3 text-center text-muted-foreground">
              Loading models...
            </Text>
          ) : models.length === 0 ? (
            <Text className="px-4 py-3 text-center text-muted-foreground">
              No models for this make
            </Text>
          ) : (
            models.map((model) => (
              <SelectItem
                key={model.id}
                label={model.name}
                type="single"
                isSelected={tempModelId === model.id}
                onSelect={() => setTempModelId(model.id)}
              />
            ))
          )}
        </Section>

        {/* Cities */}
        <Section title="Cities">
          <SelectItem
            label="All Cities"
            type="multi"
            isSelected={tempCityIds.length === 0}
            onSelect={() => setTempCityIds([])}
          />
          {cities.length > 0 ? (
            cities.map((city) => (
              <SelectItem
                key={city.id}
                label={city.name}
                type="multi"
                isSelected={tempCityIds.includes(city.id)}
                onSelect={() => toggleCity(city.id)}
              />
            ))
          ) : (
            <Text className="px-4 py-3 text-center text-muted-foreground">
              No cities available
            </Text>
          )}
        </Section>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 w-full border-t border-border bg-background px-4 py-3 shadow-lg shadow-black/10">
        <Pressable
          onPress={clearAll}
          className="mb-3 rounded-lg border border-border py-3 active:opacity-80"
        >
          <Text className="text-center font-medium text-muted-foreground">
            Clear All
          </Text>
        </Pressable>
        <Pressable
          onPress={handleApply}
          className="rounded-lg bg-primary py-3 active:opacity-90"
        >
          <Text className="text-center font-semibold text-primary-foreground">
            Apply Filters
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default FilterModal;
