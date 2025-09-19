import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
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

  const [behaviour, setBehaviour] = useState<"padding" | undefined>("padding");

  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
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

  // Mutations
  const createListing = useMutation(
    trpc.listing.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.listing.list.pathFilter());
        Toast.show({ type: "success", text1: "Listing created!" });
        navigation.goBack();
      },
      onError: () => {
        Toast.show({ type: "error", text1: "Failed to create listing" });
      },
    }),
  );

  const getPresignedUrl = useMutation(
    trpc.uploader.getPreSignedUrl.mutationOptions({
      onError: () => {
        Toast.show({ type: "error", text1: "Image upload failed" });
      },
    }),
  );

  // Pick images
  const handlePickImages = async () => {
    const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024; // 5 MB

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ["images"],
      quality: 0.8,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const validAssets = [];
      let oversizedImagesCount = 0;

      for (const asset of result.assets) {
        // console.log(`Image: ${asset.fileName}, Size: ${asset.fileSize} bytes`);
        if (asset.fileSize && asset.fileSize > MAX_IMAGE_SIZE_BYTES) {
          oversizedImagesCount++;
          continue; // Skip this image
        }
        validAssets.push({
          uri: asset.uri,
          name: asset.fileName ?? `image_${Date.now()}_${Math.random()}.jpg`,
          type: asset.type ?? "image/jpeg",
        });
      }

      if (oversizedImagesCount > 0) {
        Toast.show({
          type: "error",
          text1: "Some images were too large",
          text2: `Please select images smaller than ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB.`,
        });
      }

      // Append valid assets, respecting the 5-image limit
      const currentImagesCount = images.length;
      const spaceLeft = 5 - currentImagesCount;
      const assetsToAdd = validAssets.slice(0, spaceLeft);

      setImages((prev) => [...prev, ...assetsToAdd.map((f) => f.uri)]);
      setImageFiles((prev) => [...prev, ...assetsToAdd]);

      if (validAssets.length > spaceLeft) {
        Toast.show({
          type: "info",
          text1: "Image limit reached",
          text2: `You can only upload a maximum of 5 images.`,
        });
      }
    }
  };

  // Upload images via presigned URLs
  const handleUploadImages = async () => {
    return Promise.all(
      imageFiles.map(async (file) => {
        const response = await fetch(file.uri);
        const blob = await response.blob();

        console.log("Blob size:", blob.size);

        const res = await getPresignedUrl.mutateAsync({
          fileName: file.name,
          fileSize: blob.size, // use blob size instead of guessing
          mimeType: file.type,
        });

        await fetch(res.presignedUrl, {
          method: "PUT",
          body: blob,
          headers: { "Content-Type": file.type },
        });

        return res.presignedUrl.split("?")[0];
      }),
    );
  };

  // Submit
  const handleSubmit = async () => {
    if (!title) {
      Toast.show({
        type: "error",
        text1: "Please enter a title for your listing.",
      });
      return;
    }

    if (!description) {
      Toast.show({
        type: "error",
        text1: "Please enter a description for your listing.",
      });
      return;
    }

    const priceValue = Number(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Toast.show({
        type: "error",
        text1: "Please enter a valid price (must be a positive number).",
      });
      return;
    }

    if (!selectedCategory) {
      Toast.show({ type: "error", text1: "Please select a category." });
      return;
    }

    if (!selectedCity) {
      Toast.show({ type: "error", text1: "Please select a city." });
      return;
    }

    if (images.length === 0) {
      Toast.show({
        type: "error",
        text1: "Please upload at least one image for your listing.",
      });
      return;
    }

    if (!selectedMake) {
      Toast.show({ type: "error", text1: "Please select a make." });
      return;
    }

    if (!selectedModel) {
      Toast.show({ type: "error", text1: "Please select a model." });
      return;
    }

    // Prepare data for validation schema (if any beyond basic checks)
    const listingData = {
      title,
      description,
      price: priceValue,
      categoryId: selectedCategory,
      makeId: selectedMake,
      modelId: selectedModel,
      cityId: selectedCity,
      partNumber: partNumber || undefined,
    };

    setIsSubmitting(true);
    try {
      const uploadedUrls = await handleUploadImages();
      await createListing.mutateAsync({
        ...listingData,
        imageUrls: uploadedUrls.filter((url): url is string => !!url),
      });
    } catch (err) {
      Toast.show({ type: "error", text1: "Something went wrong" });
      console.log("Error creating listing: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      setBehaviour("padding");
    });
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setBehaviour(undefined);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
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
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "android" ? behaviour : undefined}
      >
        <Header title="Create" />
        <ScrollView className="flex-1 px-3 pt-3">
          {/* Photos */}
          <Section title="Photos (up to 5)">
            <ScrollView
              horizontal
              className="flex flex-row p-3"
              showsHorizontalScrollIndicator={false}
            >
              {images.map((uri, idx) => (
                <View key={idx} className="relative mr-3">
                  <Image
                    source={{ uri }}
                    className="h-28 w-28 rounded-lg border border-border object-cover"
                  />
                  <Pressable
                    onPress={() => {
                      setImages((prev) => prev.filter((_, i) => i !== idx));
                      setImageFiles((prev) => prev.filter((_, i) => i !== idx));
                    }}
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
