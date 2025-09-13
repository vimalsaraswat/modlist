import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";

import { otpSchema, phoneSchema } from "@acme/validators";

import { useThemeColors } from "~/styles/colors";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";
import SignOut from "./sign-out";

export default function OnboardingScreen() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const router = useRouter();
  const theme = useThemeColors();

  const user = session?.user;

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");
  const [imageUri, setImageUri] = useState<string | null>(user?.image ?? null);

  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneCooldown, setPhoneCooldown] = useState(0);

  const [loading, setLoading] = useState<null | string>(null);
  const [error, setError] = useState<string | null>(null);

  // === TRPC / API mutations ===
  const getPresignedUrl = useMutation(
    trpc.uploader.getPreSignedUrl.mutationOptions({
      onError: () =>
        Toast.show({ type: "error", text1: "Image upload failed" }),
    }),
  );

  const updateProfile = useMutation(
    trpc.auth.updateUserProfile.mutationOptions({
      onSuccess: () => {
        Toast.show({ type: "success", text1: "Profile updated" });
        router.replace("/");
      },
      onError: (err) => Alert.alert("Error", err.message),
    }),
  );

  // === Phone OTP - send ===
  const handleSendPhoneOtp = async () => {
    setError(null);
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid phone number");
      return;
    }
    if (loading) return;

    try {
      setLoading("phone-send");
      const { data, error: apiError } = await authClient.phoneNumber.sendOtp({
        phoneNumber: "+91" + phone,
      });
      if (apiError) throw apiError;
      if (data) {
        setPhoneOtpSent(true);
        setPhoneCooldown(120); // Start 2-minute timer
        Toast.show({ type: "success", text1: "OTP sent" });
      } else {
        throw new Error("Unexpected response sending OTP");
      }
    } catch (err: any) {
      console.error("sendPhoneOtp:", err);
      const msg = err?.message ?? "Failed to send OTP. Try again.";
      setError(msg);
      Alert.alert("Failed to send OTP", msg);
    } finally {
      setLoading(null);
    }
  };

  // === Phone OTP - verify ===
  const handleVerifyPhoneOtp = async () => {
    setError(null);
    const r = otpSchema.safeParse(phoneOtp);
    if (!r.success) {
      setError(r.error.issues[0]?.message ?? "Invalid OTP");
      return;
    }
    if (loading) return;

    try {
      setLoading("phone-verify");
      const { data, error: apiError } = await authClient.phoneNumber.verify({
        phoneNumber: "+91" + phone,
        code: phoneOtp,
        disableSession: true,
        updatePhoneNumber: true,
      });

      if (apiError) throw apiError;
      if (data) {
        refetch();
        Toast.show({ type: "success", text1: "Phone verified" });
        setPhoneOtpSent(false);
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (err) {
      const error = err as Error;
      console.error("verifyPhoneOtp:", err);
      const msg = error?.message ?? "Invalid OTP. Try again.";
      setError(msg);
      Alert.alert("Verification failed", msg);
    } finally {
      setLoading(null);
    }
  };

  // === Pick single profile image ===
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // === Upload profile image ===
  const handleUploadImage = async (): Promise<string | null> => {
    if (!imageUri || imageUri.startsWith("http")) return imageUri;

    const response = await fetch(imageUri);
    const blob = await response.blob();

    const fileName = `profile_${user?.id}_${Date.now()}.jpg`;
    const res = await getPresignedUrl.mutateAsync({
      fileName,
      fileSize: blob.size,
      mimeType: blob.type || "image/jpeg",
    });

    await fetch(res.presignedUrl, {
      method: "PUT",
      body: blob,
      headers: { "Content-Type": blob.type || "image/jpeg" },
    });

    return res.presignedUrl.split("?")[0] ?? null;
  };

  // === Save / Submit ===
  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter your name");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Validation", "Please enter your mobile number");
      return;
    }

    // if phone not verified → block until verified
    if (!user?.phoneNumberVerified) {
      Alert.alert("Validation", "Verify your phone number first");
      return;
    }

    setLoading("submit");
    try {
      const uploadedUrl = await handleUploadImage();
      if (name.trim() !== user?.name || uploadedUrl !== user?.image) {
        await updateProfile.mutateAsync({
          name,
          image: uploadedUrl ?? undefined,
        });
      } else {
        Toast.show({ type: "success", text1: "Profile updated" });
        router.replace("/");
      }
    } finally {
      setLoading(null);
    }
  };

  // === cooldown timer ===
  useEffect(() => {
    if (phoneCooldown > 0) {
      const id = setTimeout(() => setPhoneCooldown((c) => c - 1), 1000);
      return () => clearTimeout(id);
    }
  }, [phoneCooldown]);

  if (isPending) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16 }}>
          {/* Header with sign out */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: theme.foreground,
                }}
              >
                Complete Your Profile
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: theme.mutedForeground,
                  marginTop: 4,
                }}
              >
                Let's set up your account
              </Text>
            </View>
            <SignOut />
          </View>

          {/* Main content card */}
          <View
            style={{
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              padding: 24,
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 8,
              elevation: 1,
            }}
          >
            {/* Profile image */}
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <Pressable onPress={handlePickImage}>
                {imageUri ? (
                  <View
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                      borderWidth: 2,
                      borderColor: theme.border,
                      overflow: "hidden",
                      shadowColor: "#000",
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Image
                      source={{ uri: imageUri }}
                      style={{ height: "100%", width: "100%" }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                      borderWidth: 2,
                      borderColor: theme.border,
                      borderStyle: "dashed",
                      backgroundColor: theme.muted,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="camera"
                      size={28}
                      color={theme.mutedForeground}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.mutedForeground,
                        marginTop: 4,
                      }}
                    >
                      Add Photo
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>

            {/* Form fields */}
            <View style={{ gap: 16 }}>
              {/* Name */}
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "500",
                    color: theme.mutedForeground,
                    marginBottom: 6,
                  }}
                >
                  Full Name
                </Text>
                <TextInput
                  placeholder="Your Name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={theme.mutedForeground}
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: theme.foreground,
                  }}
                />
              </View>

              {/* Phone */}
              <View>
                <View className="flex flex-row items-center">
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "500",
                      color: theme.mutedForeground,
                      marginBottom: 6,
                    }}
                  >
                    Mobile Number{" "}
                  </Text>
                  {user?.phoneNumberVerified && (
                    <View className="flex-row items-center rounded-full bg-muted px-2 py-0.5">
                      <Ionicons
                        name="shield-checkmark"
                        color={theme.mutedForeground}
                        size={14}
                      />
                      <Text className="ml-1 text-xs text-muted-foreground">
                        Verified
                      </Text>
                    </View>
                  )}
                </View>
                <TextInput
                  editable={!user?.phoneNumberVerified && !(phoneCooldown > 0)}
                  placeholder="9876543210"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor={theme.mutedForeground}
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: theme.foreground,
                  }}
                />
              </View>

              {/* OTP flow */}
              {!user?.phoneNumberVerified && phoneOtpSent && (
                <View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "500",
                      color: theme.mutedForeground,
                      marginBottom: 6,
                    }}
                  >
                    Verification Code
                  </Text>
                  <TextInput
                    placeholder="Enter 6-digit OTP"
                    value={phoneOtp}
                    onChangeText={(t) =>
                      setPhoneOtp(t.replace(/[^\d]/g, "").slice(0, 6))
                    }
                    keyboardType="number-pad"
                    placeholderTextColor={theme.mutedForeground}
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      color: theme.foreground,
                      textAlign: "center",
                      fontSize: 18,
                      letterSpacing: 8,
                    }}
                    maxLength={6}
                  />
                  {/* === ADDED: Resend OTP and Timer logic === */}
                  <View style={{ marginTop: 12, alignItems: "center" }}>
                    {phoneCooldown > 0 ? (
                      <Text
                        style={{
                          color: theme.mutedForeground,
                          fontSize: 13,
                        }}
                      >
                        Resend OTP in {phoneCooldown} seconds
                      </Text>
                    ) : (
                      <TouchableOpacity
                        onPress={handleSendPhoneOtp}
                        disabled={loading === "phone-send"}
                      >
                        <Text
                          style={{
                            color: theme.primary,
                            fontWeight: "600",
                            fontSize: 13,
                          }}
                        >
                          Resend OTP
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>

            {/* Error message */}
            {error && (
              <Text
                style={{
                  color: theme.destructive,
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
            )}

            {/* Action Buttons */}
            <View style={{ marginTop: 24, gap: 12 }}>
              {/* Phone verification buttons */}
              {!user?.phoneNumberVerified &&
                (phoneOtpSent ? (
                  <TouchableOpacity
                    disabled={loading === "phone-verify"}
                    onPress={handleVerifyPhoneOtp}
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      padding: 12,
                      backgroundColor:
                        loading === "phone-verify"
                          ? theme.secondary
                          : theme.primary,
                    }}
                  >
                    {loading === "phone-verify" ? (
                      <ActivityIndicator color={theme.primaryForeground} />
                    ) : (
                      <Text
                        style={{
                          color: theme.primaryForeground,
                          fontWeight: "600",
                        }}
                      >
                        Verify OTP
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    disabled={loading === "phone-send"}
                    onPress={handleSendPhoneOtp}
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      padding: 12,
                      backgroundColor:
                        loading === "phone-send"
                          ? theme.secondary
                          : theme.accent,
                    }}
                  >
                    {loading === "phone-send" ? (
                      <ActivityIndicator color={theme.accentForeground} />
                    ) : (
                      <Text
                        style={{
                          color: theme.accentForeground,
                          fontWeight: "600",
                        }}
                      >
                        Send OTP
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}

              {/* Submit button */}
              <TouchableOpacity
                disabled={loading === "submit"}
                onPress={handleSubmit}
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  padding: 12,
                  backgroundColor:
                    loading === "submit" ? theme.secondary : theme.primary,
                }}
              >
                {loading === "submit" ? (
                  <ActivityIndicator color={theme.primaryForeground} />
                ) : (
                  <Text
                    style={{
                      color: theme.primaryForeground,
                      fontWeight: "600",
                    }}
                  >
                    Complete Setup
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
