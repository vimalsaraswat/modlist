import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
// import * as ImagePicker from "expo-image-picker";
import { Stack, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

import InputField from "~/components/common/input-field";
import SearchableDropdown from "~/components/common/searchable-dropdown";
import Header from "~/components/listings/new/header";
import { trpc } from "~/utils/api";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View className="mb-6">
    <Text className="mb-3 px-4 text-lg font-bold text-foreground">{title}</Text>
    <View className="rounded-lg border border-border/50 bg-card/30 pt-2">
      {children}
    </View>
  </View>
);

const AddListingScreen = () => {
  const queryClient = useQueryClient();

  const navigation = useNavigation();
  // Form state
  const [title, setTitle] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedMake, setSelectedMake] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
  const { data: categories = [] } = useQuery(
    trpc.listing.categoryList.queryOptions(),
  );
  const { data: makes = [] } = useQuery(trpc.listing.makeList.queryOptions());
  const { data: cities = [] } = useQuery(trpc.listing.cityList.queryOptions());

  const { data: models = [], isPending: modelsLoading } = useQuery(
    trpc.listing.modelListByMake.queryOptions(
      { makeId: selectedMake ?? -1 },
      { enabled: !!selectedMake },
    ),
  );

  const createListing = useMutation(
    trpc.listing.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.listing.list.pathFilter());
        // toast.success("Listing created!");
        // navigation.goBack();
      },
      onError: () => {
        // toast.error("Failed to create listing");
      },
    }),
  );

  // Handlers
  const handlePickImages = async () => {
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   allowsMultipleSelection: true,
    //   mediaTypes: ["images"],
    //   quality: 0.8,
    //   selectionLimit: 5,
    // });
    // if (!result.canceled) {
    //   setImages(result.assets.map((a) => a.uri).slice(0, 5));
    // }
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !price ||
      !selectedCategory ||
      !selectedCity ||
      !selectedMake ||
      !selectedModel
    ) {
      Toast.show({
        type: "error",
        text1: "Please fill in all required fields",
      });
      return;
    }
    if (images.length === 0) {
      Toast.show({
        type: "error",
        text1: "Please upload at least one image",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await createListing.mutateAsync({
        title,
        description,
        price: Number(price),
        categoryId: selectedCategory,
        makeId: selectedMake,
        modelId: selectedModel,
        cityId: selectedCity,
        imageUrls: images, // TODO: hook up presigned URL upload flow
        partNumber,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarVisible: false,
    });
    return () => {
      navigation.getParent()?.setOptions({ tabBarVisible: true });
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "Create Listing",
          headerShown: false,
        }}
      />
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <Header title="Create" />
        <ScrollView className="flex-1 px-3 pt-3">
          {/* Photos */}
          <Section title="Photos (up to 5)">
            <ScrollView
              horizontal
              className="flex-row gap-3 p-3"
              showsHorizontalScrollIndicator={false}
            >
              {images.map((uri, idx) => (
                <View key={idx} className="relative">
                  <Image
                    source={{ uri }}
                    className="h-28 w-28 rounded-lg border border-border object-cover"
                  />
                  <Pressable
                    onPress={() =>
                      setImages((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1"
                  >
                    <Ionicons name="close" size={14} color="white" />
                  </Pressable>
                </View>
              ))}
              {images.length < 5 && (
                <Pressable
                  onPress={handlePickImages}
                  className="h-28 w-28 items-center justify-center rounded-lg border-2 border-dashed border-border"
                >
                  <Ionicons name="add" size={24} color="#9CA3AF" />
                  <Text className="text-xs text-muted-foreground">Add</Text>
                </Pressable>
              )}
            </ScrollView>
          </Section>

          {/* Basic Info */}
          <Section title="Basic Information">
            <InputField
              label="Title *"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Garrett GT2860RS Turbo Kit"
            />
            <InputField
              label="Part Number"
              value={partNumber}
              onChangeText={setPartNumber}
              placeholder="e.g., GT2860RS-KIT"
            />
            <InputField
              label="Description *"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the part..."
              multiline
            />
            {/* Category Dropdown */}
            <View className="mb-4 px-4">
              <Text className="mb-2 text-sm font-semibold text-foreground">
                Category *
              </Text>
              <SearchableDropdown
                options={categories.map((c) => ({
                  label: c.name,
                  value: c.id,
                }))}
                selectedValue={selectedCategory}
                onSelect={(opt) => setSelectedCategory(opt.value as number)}
                placeholder="Select a category"
                modalTitle="Choose Category"
              />
            </View>
          </Section>

          {/* Compatibility */}
          <Section title="Car Compatibility">
            {/* Make Dropdown */}
            <View className="mb-4 px-4">
              <Text className="mb-2 text-sm font-semibold text-foreground">
                Make
              </Text>
              <SearchableDropdown
                options={makes.map((m) => ({ label: m.name, value: m.id }))}
                selectedValue={selectedMake}
                onSelect={(opt) => setSelectedMake(opt.value as number)}
                placeholder="Select a make"
                modalTitle="Choose Make"
              />
            </View>

            {/* Model Dropdown (depends on make) */}
            {selectedMake && (
              <View className="mb-4 px-4">
                <Text className="mb-2 text-sm font-semibold text-foreground">
                  Model
                </Text>
                <SearchableDropdown
                  options={models.map((m) => ({ label: m.name, value: m.id }))}
                  selectedValue={selectedModel}
                  onSelect={(opt) => setSelectedModel(opt.value as number)}
                  placeholder={
                    modelsLoading ? "Loading models..." : "Select a model"
                  }
                  modalTitle="Choose Model"
                />
              </View>
            )}
          </Section>

          {/* Price & Location */}
          <Section title="Price & Location">
            <InputField
              label="Price (INR) *"
              value={price}
              onChangeText={setPrice}
              placeholder="0"
              keyboardType="numeric"
            />

            {/* City Dropdown */}
            <View className="mb-4 px-4">
              <Text className="mb-2 text-sm font-semibold text-foreground">
                City *
              </Text>
              <SearchableDropdown
                options={cities.map((c) => ({ label: c.name, value: c.id }))}
                selectedValue={selectedCity}
                onSelect={(opt) => setSelectedCity(opt.value as number)}
                placeholder="Select a city"
                modalTitle="Choose City"
              />
            </View>
          </Section>
        </ScrollView>

        {/* Submit Button */}
        <View className="bg-background p-4">
          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={clsx(
              "w-full items-center justify-center rounded-lg py-4",
              isSubmitting ? "bg-muted" : "bg-primary",
            )}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-semibold text-foreground">
                Publish Listing
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddListingScreen;
