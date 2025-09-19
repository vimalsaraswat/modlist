import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { emailSchema, otpSchema, phoneSchema } from "@acme/validators";

import { useThemeColors } from "~/styles/colors";
import { authClient } from "~/utils/auth";

type Mode = "email" | "mobile";
type Step = "CHOICE" | "ENTER" | "VERIFY";

export default function SignInScreen() {
  const navigation = useNavigation();
  const theme = useThemeColors();
  const router = useRouter();

  // global UI
  const [mode, setMode] = useState<Mode>("email"); // selected OTP mode
  const [step, setStep] = useState<Step>("CHOICE");

  // email fields
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  // phone fields
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneCooldown, setPhoneCooldown] = useState(0);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  // loading state: null | "google" | "email-send" | "email-verify" | "phone-send" | "phone-verify"
  const [loading, setLoading] = useState<
    | null
    | "google"
    | "email-send"
    | "email-verify"
    | "phone-send"
    | "phone-verify"
  >(null);

  // UI error message
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Prevent default behavior of leaving the screen
      if (e.data.action.type === "GO_BACK") {
        e.preventDefault();
        // Optionally, show a confirmation dialog here
        Alert.alert(
          "Leave Sign In?",
          "Your progress will be lost. Are you sure you want to leave?",
          [
            { text: "Stay", style: "cancel", onPress: () => {} },
            {
              text: "Leave",
              style: "destructive",
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        );
      }
    });

    return unsubscribe;
  }, [navigation]);

  // timers for cooldowns
  useEffect(() => {
    if (emailCooldown <= 0) return;
    const t = setInterval(
      () => setEmailCooldown((c) => Math.max(0, c - 1)),
      1000,
    );
    return () => clearInterval(t);
  }, [emailCooldown]);

  useEffect(() => {
    if (phoneCooldown <= 0) return;
    const t = setInterval(
      () => setPhoneCooldown((c) => Math.max(0, c - 1)),
      1000,
    );
    return () => clearInterval(t);
  }, [phoneCooldown]);

  // derived disables
  const sendEmailDisabled = useMemo(
    () => loading !== null || emailCooldown > 0,
    [loading, emailCooldown],
  );
  const sendPhoneDisabled = useMemo(
    () => loading !== null || phoneCooldown > 0,
    [loading, phoneCooldown],
  );

  /**
   * SOCIAL (Google) sign-in
   */
  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading("google");
      // Typically this will open a browser / web auth flow or uses expo-auth-session
      await authClient.signIn.social({ provider: "google", callbackURL: "/" });
      // If your endpoint returns synchronously, redirect to root:
      router.replace("/");
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      const msg = err?.message ?? "Google sign-in failed. Try again.";
      setError(msg);
      Alert.alert("Sign in failed", msg);
    } finally {
      setLoading(null);
    }
  };

  /**
   * EMAIL OTP - send
   */
  const handleSendEmailOtp = async () => {
    setError(null);
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    if (sendEmailDisabled) return;

    try {
      setLoading("email-send");
      const { data, error: apiError } =
        await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "sign-in",
        });
      if (apiError) throw apiError;
      if (data) {
        setEmailOtpSent(true);
        setEmailCooldown(120); // 120s cooldown
        setStep("VERIFY");
        setMode("email");
      } else {
        // fallback: inform user
        throw new Error("Unexpected response sending OTP");
      }
    } catch (err: any) {
      console.error("sendEmailOtp:", err);
      const msg = err?.message ?? "Failed to send OTP. Try again.";
      setError(msg);
      Alert.alert("Failed to send OTP", msg);
    } finally {
      setLoading(null);
    }
  };

  /**
   * EMAIL OTP - verify
   */
  const handleVerifyEmailOtp = async () => {
    setError(null);
    const r = otpSchema.safeParse(emailOtp);
    if (!r.success) {
      setError(r.error.issues[0]?.message ?? "Invalid OTP");
      return;
    }
    if (loading !== null) return;

    try {
      setLoading("email-verify");
      const { data, error: apiError } = await authClient.signIn.emailOtp({
        email,
        otp: emailOtp,
      });
      if (apiError) throw apiError;
      if (data) {
        // success
        Alert.alert("Signed in", "Signed in with email OTP");
        // navigate to root or reload app state
        router.replace("/");
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (err: any) {
      console.error("verifyEmailOtp:", err);
      const msg = err?.message ?? "Invalid OTP. Try again.";
      setError(msg);
      Alert.alert("Verification failed", msg);
    } finally {
      setLoading(null);
    }
  };

  /**
   * PHONE OTP - send
   */
  const handleSendPhoneOtp = async () => {
    setError(null);
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid phone number");
      return;
    }
    if (sendPhoneDisabled) return;

    try {
      setLoading("phone-send");
      const { data, error: apiError } = await authClient.phoneNumber.sendOtp({
        phoneNumber: phone,
      });
      if (apiError) throw apiError;
      if (data) {
        setPhoneOtpSent(true);
        setPhoneCooldown(120);
        setStep("VERIFY");
        setMode("mobile");
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

  /**
   * PHONE OTP - verify
   */
  const handleVerifyPhoneOtp = async () => {
    setError(null);
    const r = otpSchema.safeParse(phoneOtp);
    if (!r.success) {
      setError(r.error.issues[0]?.message ?? "Invalid OTP");
      return;
    }
    if (loading !== null) return;

    try {
      setLoading("phone-verify");
      const { data, error: apiError } = await authClient.phoneNumber.verify({
        phoneNumber: phone,
        code: phoneOtp,
        disableSession: false,
        updatePhoneNumber: false,
      });

      if (apiError) throw apiError;
      if (data) {
        Alert.alert("Signed in", "Signed in with mobile OTP");
        router.replace("/");
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (err: any) {
      console.error("verifyPhoneOtp:", err);
      const msg = err?.message ?? "Invalid OTP. Try again.";
      setError(msg);
      Alert.alert("Verification failed", msg);
    } finally {
      setLoading(null);
    }
  };

  /**
   * Resend handlers (respect cooldown)
   */
  const handleResend = async () => {
    if (mode === "email") {
      if (emailCooldown > 0) return;
      await handleSendEmailOtp();
    } else {
      if (phoneCooldown > 0) return;
      await handleSendPhoneOtp();
    }
  };

  /**
   * UI helpers: reset to choice screen
   */
  const handleChangeMethod = () => {
    setStep("CHOICE");
    setEmailOtp("");
    setPhoneOtp("");
    setError(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 38 }}>
          <View style={{ marginBottom: 28, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: theme.foreground,
              }}
            >
              Welcome back
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: theme.mutedForeground,
                marginTop: 6,
              }}
            >
              Sign in to continue
            </Text>
          </View>

          <View
            style={{
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              padding: 18,
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 8,
              elevation: 1,
            }}
          >
            {/* CHOICE */}
            {step === "CHOICE" && (
              <>
                {/* Google */}
                <Pressable
                  onPress={handleGoogleSignIn}
                  disabled={loading === "google"}
                  style={{
                    marginBottom: 12,
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    borderRadius: 12,
                    padding: 12,
                    backgroundColor: theme.primary,
                  }}
                >
                  {loading === "google" ? (
                    <ActivityIndicator color={theme.primaryForeground} />
                  ) : (
                    <Ionicons
                      name="logo-google"
                      size={18}
                      color={theme.primaryForeground}
                    />
                  )}
                  <Text
                    style={{
                      color: theme.primaryForeground,
                      fontWeight: "600",
                    }}
                  >
                    Continue with Google
                  </Text>
                </Pressable>

                <Text
                  style={{
                    textAlign: "center",
                    marginVertical: 8,
                    color: theme.mutedForeground,
                  }}
                >
                  or
                </Text>

                {/* Mode selector */}
                <View
                  style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
                >
                  {/*<Pressable
                    onPress={() => setMode("email")}
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor:
                        mode === "email" ? theme.primary : theme.border,
                      backgroundColor:
                        mode === "email" ? theme.primary : theme.background,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          mode === "email"
                            ? theme.primaryForeground
                            : theme.foreground,
                      }}
                    >
                      Email
                    </Text>
                  </Pressable>*/}
                  {/*<Pressable
                    onPress={() => setMode("mobile")}
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor:
                        mode === "mobile" ? theme.primary : theme.border,
                      backgroundColor:
                        mode === "mobile" ? theme.primary : theme.background,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          mode === "mobile"
                            ? theme.primaryForeground
                            : theme.foreground,
                      }}
                    >
                      Mobile
                    </Text>
                  </Pressable>*/}
                </View>

                {/* Input depending on mode */}
                {mode === "email" ? (
                  <>
                    <TextInput
                      placeholder="you@example.com"
                      placeholderTextColor="#888"
                      value={email}
                      onChangeText={(t) => setEmail(t)}
                      style={{
                        marginBottom: 12,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: theme.border,
                        backgroundColor: theme.background,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        color: theme.foreground,
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={loading === null}
                      returnKeyType="send"
                      onSubmitEditing={handleSendEmailOtp}
                    />
                    <Pressable
                      onPress={handleSendEmailOtp}
                      disabled={
                        loading === "email-send" || !email || emailCooldown > 0
                      }
                      style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        padding: 12,
                        backgroundColor:
                          loading === "email-send" ||
                          !email ||
                          emailCooldown > 0
                            ? theme.secondary
                            : theme.primary,
                      }}
                    >
                      {loading === "email-send" ? (
                        <ActivityIndicator color={theme.secondaryForeground} />
                      ) : emailCooldown > 0 ? (
                        <Text style={{ color: theme.secondaryForeground }}>
                          Resend OTP in {emailCooldown}s
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: !email
                              ? theme.secondaryForeground
                              : theme.primaryForeground,
                            fontWeight: "600",
                          }}
                        >
                          Send OTP
                        </Text>
                      )}
                    </Pressable>
                  </>
                ) : (
                  <>
                    <TextInput
                      placeholder="9876543210"
                      placeholderTextColor="#888"
                      value={phone}
                      onChangeText={(t) =>
                        setPhone(t.replace(/[^\d]/g, "").slice(0, 10))
                      }
                      style={{
                        marginBottom: 12,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: theme.border,
                        backgroundColor: theme.background,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        color: theme.foreground,
                      }}
                      keyboardType="phone-pad"
                      editable={loading === null}
                      returnKeyType="send"
                      onSubmitEditing={handleSendPhoneOtp}
                    />
                    <Pressable
                      onPress={handleSendPhoneOtp}
                      disabled={
                        loading === "phone-send" || !phone || phoneCooldown > 0
                      }
                      style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        padding: 12,
                        backgroundColor:
                          loading === "phone-send" ||
                          !phone ||
                          phoneCooldown > 0
                            ? theme.secondary
                            : theme.primary,
                      }}
                    >
                      {loading === "phone-send" ? (
                        <ActivityIndicator color={theme.secondaryForeground} />
                      ) : phoneCooldown > 0 ? (
                        <Text style={{ color: theme.secondaryForeground }}>
                          Resend OTP in {phoneCooldown}s
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: theme.primaryForeground,
                            fontWeight: "600",
                          }}
                        >
                          Send OTP
                        </Text>
                      )}
                    </Pressable>
                  </>
                )}
              </>
            )}

            {/* ENTER/VERIFY */}
            {step === "ENTER" && (
              <View>
                {/* Not currently used but kept for parity - you can swap to ENTER if you want a separate "enter" step */}
              </View>
            )}

            {step === "VERIFY" && (
              <>
                <Text
                  style={{
                    marginBottom: 8,
                    textAlign: "center",
                    color: theme.mutedForeground,
                  }}
                >
                  {mode === "email"
                    ? `OTP sent to ${email}`
                    : `OTP sent to ${phone}`}
                </Text>

                <TextInput
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="#888"
                  value={mode === "email" ? emailOtp : phoneOtp}
                  onChangeText={(t) =>
                    mode === "email"
                      ? setEmailOtp(t.replace(/[^\d]/g, "").slice(0, 6))
                      : setPhoneOtp(t.replace(/[^\d]/g, "").slice(0, 6))
                  }
                  style={{
                    marginBottom: 12,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    textAlign: "center",
                    fontSize: 20,
                    letterSpacing: 8,
                    color: theme.foreground,
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                />

                <Pressable
                  onPress={
                    mode === "email"
                      ? handleVerifyEmailOtp
                      : handleVerifyPhoneOtp
                  }
                  disabled={
                    loading === "email-verify" ||
                    loading === "phone-verify" ||
                    (mode === "email"
                      ? emailOtp.length < 6
                      : phoneOtp.length < 6)
                  }
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    padding: 12,
                    backgroundColor:
                      loading === "email-verify" || loading === "phone-verify"
                        ? theme.secondary
                        : theme.primary,
                  }}
                >
                  {loading === "email-verify" || loading === "phone-verify" ? (
                    <ActivityIndicator color={theme.secondaryForeground} />
                  ) : (
                    <Text
                      style={{
                        color: theme.primaryForeground,
                        fontWeight: "600",
                      }}
                    >
                      Verify & Continue
                    </Text>
                  )}
                </Pressable>

                <View style={{ marginTop: 12, alignItems: "center" }}>
                  {(mode === "email" && emailCooldown > 0) ||
                  (mode === "mobile" && phoneCooldown > 0) ? (
                    <Text style={{ color: theme.mutedForeground }}>
                      Resend available in{" "}
                      {mode === "email" ? emailCooldown : phoneCooldown}s
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleResend}>
                      <Text style={{ color: theme.primary, fontWeight: "600" }}>
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/*<TouchableOpacity
                    onPress={handleChangeMethod}
                    style={{ marginTop: 8 }}
                  >
                    <Text style={{ color: theme.mutedForeground }}>
                      Change method
                    </Text>
                  </TouchableOpacity>*/}
                </View>
              </>
            )}
          </View>

          {/* Error text */}
          {!!error && (
            <Text
              style={{
                marginTop: 14,
                textAlign: "center",
                color: theme.destructive,
              }}
            >
              {error}
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
