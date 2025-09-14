"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import { Input } from "@acme/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@acme/ui/input-otp";
import { Label } from "@acme/ui/label";
import { toast } from "@acme/ui/toast";
import { otpSchema, phoneSchema } from "@acme/validators";

import { authClient } from "~/auth/client";
import { useTRPC } from "~/trpc/react";

export default function OnboardingDialog() {
  const { refetch, data, isPending: isLoading } = authClient.useSession();
  const user = data?.user;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(user?.image ?? null);

  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneCooldown, setPhoneCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(
    user?.phoneNumberVerified ?? false,
  );

  // New state to control the dialog's visibility internally
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();

  const getPresignedUrl = useMutation(
    trpc.uploader.getPreSignedUrl.mutationOptions({
      onError: () => {
        toast.error("Image upload failed");
      },
    }),
  );

  const updateProfile = useMutation(
    trpc.auth.updateUserProfile.mutationOptions({
      onSuccess: () => {
        toast.success("Profile updated successfully!");
        refetch(); // Re-fetch the session to get the new data
        setOpen(false); // Close the dialog on success
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  // === Effect to check session and open the dialog ===
  useEffect(() => {
    // Only proceed if session data has loaded
    if (!isLoading && user) {
      // Check for an incomplete profile. A profile is incomplete if any of these are missing:
      // name, image, or phone number verification.
      const incompleteProfile =
        !user.name || !user.image || !user.phoneNumberVerified;

      // If the profile is incomplete, open the dialog.
      // Otherwise, ensure it is closed.
      if (incompleteProfile) {
        setName(user.name ?? "");
        setPhone(user.phoneNumber ?? "");
        setImagePreview(user.image ?? null);
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [isLoading, user]);

  // === Cooldown timer effect ===
  useEffect(() => {
    if (phoneCooldown > 0) {
      const timer = setTimeout(() => setPhoneCooldown((p) => p - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phoneCooldown]);

  // === Phone OTP flow ===
  const handleSendPhoneOtp = async () => {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid phone number");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await authClient.phoneNumber.sendOtp({
        phoneNumber: phone,
      });
      if (data) {
        toast.success("OTP sent to mobile");
        setPhoneOtpSent(true);
        setPhoneCooldown(60);
      }
      if (error) toast.error(error.message);
    } catch {
      toast.error("Failed to send mobile OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    const result = otpSchema.safeParse(phoneOtp);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid OTP");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await authClient.phoneNumber.verify({
        phoneNumber: phone,
        code: phoneOtp,
        disableSession: true,
        updatePhoneNumber: true,
      });
      if (data) {
        toast.success("Phone verified!");
        setPhoneVerified(true);
        setPhoneOtpSent(false);
        refetch();
      }
      if (error) toast.error(error.message);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // === Image handling ===
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return user?.image ?? null;

    const res = await getPresignedUrl.mutateAsync({
      fileName: `profile_${user?.id}_${Date.now()}.jpg`,
      fileSize: imageFile?.size,
      mimeType: imageFile?.type || "image/jpeg",
    });

    await fetch(res.presignedUrl, {
      method: "PUT",
      body: imageFile,
      headers: { "Content-Type": imageFile.type || "image/jpeg" },
    });

    return res.presignedUrl.split("?")[0] ?? null;
  };

  // === Save profile ===
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    // if (!phoneVerified) {
    //   toast.warning("Please verify your phone number first.");
    //   return;
    // }

    setLoading(true);
    try {
      const uploadedUrl = await handleUploadImage();
      await updateProfile.mutateAsync({
        name: name.trim(),
        image: uploadedUrl ?? undefined,
      });
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Render nothing if the session is loading or if the dialog is not open
  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[calc(100vw-1rem)] space-y-6 sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Complete Your Profile
          </DialogTitle>
          <DialogDescription>
            Let's set up your account details.
          </DialogDescription>
        </DialogHeader>
        {user?.name && user?.image && (
          <div className="flex flex-col items-center gap-4">
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone-input">
                Mobile Number
                {phoneVerified && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    Verified
                  </span>
                )}
              </Label>
              <Input
                id="phone-input"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={phoneVerified || loading}
              />
            </div>

            {/* OTP Flow */}
            {!phoneVerified && (
              <div className="space-y-2">
                {!phoneOtpSent ? (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleSendPhoneOtp}
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <Label className="text-xs text-muted-foreground">
                      Enter the 6-digit code sent to{" "}
                      <span className="font-semibold text-foreground">
                        {phone}
                      </span>
                    </Label>
                    <InputOTP
                      maxLength={6}
                      value={phoneOtp}
                      onChange={(val) => setPhoneOtp(val)}
                      disabled={loading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 text-xs text-muted-foreground"
                        disabled={loading}
                        onClick={() => setPhoneOtpSent(false)}
                      >
                        Change phone
                      </Button>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 text-xs text-muted-foreground"
                        onClick={handleSendPhoneOtp}
                        disabled={phoneCooldown > 0 || loading}
                      >
                        {loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {phoneCooldown > 0
                          ? `Resend in ${phoneCooldown}s`
                          : "Resend OTP"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {phoneOtpSent && !phoneVerified && (
              <Button
                type="button"
                className="w-full"
                onClick={handleVerifyPhoneOtp}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify OTP
              </Button>
            )}
          </div>
        )}

        {!(user?.name && user?.image) && (
          <div className="flex flex-col items-center gap-4">
            {/* Image Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-dashed border-border"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-muted text-muted-foreground">
                  <Camera className="h-6 w-6" />
                  <span className="mt-1 text-xs">Add Photo</span>
                </div>
              )}
            </button>

            {/* Form fields */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSaveProfile();
              }}
              className="w-full space-y-4"
            >
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name-input">Full Name</Label>
                <Input
                  id="name-input"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
