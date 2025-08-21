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

const AddGarageCarScreen = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [selectedMake, setSelectedMake] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<
    { uri: string; name: string; type: string }[]
  >([]);

  const [behaviour, setBehaviour] = useState<"padding" | undefined>("padding");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
  const { data: makes = [] } = useQuery(trpc.listing.makeList.queryOptions());
  const { data: models = [], isPending: modelsLoading } = useQuery(
    trpc.listing.modelListByMake.queryOptions(
      { makeId: selectedMake ?? -1 },
      { enabled: !!selectedMake },
    ),
  );

  // Mutations
  const addCar = useMutation(
    trpc.garage.addCar.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.garage.myGarage.pathFilter());
        Toast.show({ type: "success", text1: "Car added to garage!" });
        navigation.goBack();
      },
      onError: () => {
        Toast.show({ type: "error", text1: "Failed to add car" });
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
    const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const validAssets = [];
      let oversizedCount = 0;

      for (const asset of result.assets) {
        if (asset.fileSize && asset.fileSize > MAX_IMAGE_SIZE_BYTES) {
          oversizedCount++;
          continue;
        }
        validAssets.push({
          uri: asset.uri,
          name: asset.fileName ?? `image_${Date.now()}_${Math.random()}.jpg`,
          type: asset.type ?? "image/jpeg",
        });
      }

      if (oversizedCount > 0) {
        Toast.show({
          type: "error",
          text1: "Some images were too large",
        });
      }

      const currentCount = images.length;
      const spaceLeft = 5 - currentCount;
      const toAdd = validAssets.slice(0, spaceLeft);

      setImages((prev) => [...prev, ...toAdd.map((f) => f.uri)]);
      setImageFiles((prev) => [...prev, ...toAdd]);

      if (validAssets.length > spaceLeft) {
        Toast.show({
          type: "info",
          text1: "Image limit reached (5 max)",
        });
      }
    }
  };

  // Upload
  const handleUploadImages = async () => {
    return Promise.all(
      imageFiles.map(async (file) => {
        const response = await fetch(file.uri);
        const blob = await response.blob();

        const res = await getPresignedUrl.mutateAsync({
          fileName: file.name,
          fileSize: blob.size,
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
    if (!selectedMake) {
      Toast.show({ type: "error", text1: "Please select a make." });
      return;
    }
    if (!selectedModel) {
      Toast.show({ type: "error", text1: "Please select a model." });
      return;
    }
    const yearValue = Number(year);
    if (isNaN(yearValue) || yearValue < 1900) {
      Toast.show({ type: "error", text1: "Please enter a valid year." });
      return;
    }
    if (images.length === 0) {
      Toast.show({ type: "error", text1: "Please upload at least one image." });
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedUrls = await handleUploadImages();
      await addCar.mutateAsync({
        makeId: selectedMake,
        modelId: selectedModel,
        year: yearValue,
        name: name || undefined,
        description: description || undefined,
        images: uploadedUrls.filter((url): url is string => !!url),
      });
    } catch (err) {
      console.error("Error adding car:", err);
      Toast.show({ type: "error", text1: "Something went wrong" });
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
          title: "Add Car",
          headerShown: false,
        }}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "android" ? behaviour : undefined}
      >
        <Header title="Add Car" />
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
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="My Evo IX"
            />
            <InputField
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your car..."
              multiline
            />
            <InputField
              label="Year *"
              value={year}
              onChangeText={setYear}
              placeholder="e.g., 2010"
              keyboardType="numeric"
            />
          </Section>

          {/* Compatibility */}
          <Section title="Car Details">
            {/* Make Dropdown */}
            <View className="mb-4 px-4">
              <Text className="mb-2 text-sm font-semibold text-foreground">
                Make *
              </Text>
              <SearchableDropdown
                options={makes.map((m) => ({ label: m.name, value: m.id }))}
                selectedValue={selectedMake}
                onSelect={(opt) => setSelectedMake(opt.value as number)}
                placeholder="Select a make"
                modalTitle="Choose Make"
              />
            </View>

            {/* Model Dropdown */}
            {selectedMake && (
              <View className="mb-4 px-4">
                <Text className="mb-2 text-sm font-semibold text-foreground">
                  Model *
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
              <Text className="font-semibold text-foreground">Save Car</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddGarageCarScreen;
