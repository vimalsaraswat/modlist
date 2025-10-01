"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { Input } from "@acme/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@acme/ui/input-otp";
import { Label } from "@acme/ui/label";
import { Separator } from "@acme/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";
import { toast } from "@acme/ui/toast";

import { signIn } from "~/actions/auth";
import { authClient } from "~/auth/client";

// Zod schemas
const emailSchema = z.string().email({ message: "Invalid email address" });
const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, { message: "Phone must be 10 digits" });
const otpSchema = z.string().length(6, { message: "OTP must be 6 digits" });

export default function SignInDialog() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Loading states
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Email states
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);

  // Phone states
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneCooldown, setPhoneCooldown] = useState(0);

  // Cooldown timer effects
  useEffect(() => {
    if (emailCooldown > 0) {
      const timer = setTimeout(() => setEmailCooldown((p) => p - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailCooldown]);

  useEffect(() => {
    if (phoneCooldown > 0) {
      const timer = setTimeout(() => setPhoneCooldown((p) => p - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phoneCooldown]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn(pathname);
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSendEmailOtp = async () => {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setSendLoading(true);
    try {
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      if (data) {
        toast.success("OTP sent to email");
        setEmailOtpSent(true);
        setEmailCooldown(60);
      }
      if (error) toast.error(error.message);
    } catch {
      toast.error("Failed to send email OTP");
    } finally {
      setSendLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    const result = otpSchema.safeParse(emailOtp);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid OTP");
      return;
    }
    setVerifyLoading(true);
    try {
      const { data, error } = await authClient.signIn.emailOtp({
        email,
        otp: emailOtp,
      });
      if (data) {
        toast.success("Signed in successfully!");
        window.location.reload();
        setOpen(false);
      }
      if (error) toast.error(error.message);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSendMobileOtp = async () => {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid phone number");
      return;
    }
    setSendLoading(true);
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
      setSendLoading(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    const result = otpSchema.safeParse(phoneOtp);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid OTP");
      return;
    }
    setVerifyLoading(true);
    try {
      const { data, error } = await authClient.phoneNumber.verify({
        phoneNumber: phone,
        code: phoneOtp,
      });
      if (data) {
        toast.success("Signed in successfully!");
        window.location.reload();
        setOpen(false);
      }
      if (error) toast.error(error.message);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleDialogChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // if (!newOpen) {
    //   // Reset all states when dialog is closed
    //   setEmail("");
    //   setEmailOtp("");
    //   setEmailOtpSent(false);
    //   setEmailCooldown(0);
    //   setPhone("");
    //   setPhoneOtp("");
    //   setPhoneOtpSent(false);
    //   setPhoneCooldown(0);
    //   setOtpMode("email");
    // }
  };

  const renderEmailForms = () => {
    if (emailOtpSent) {
      return (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleVerifyEmailOtp();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-foreground">{email}</span>
            </Label>
            <InputOTP
              autoFocus
              maxLength={6}
              value={emailOtp}
              onChange={(val) => setEmailOtp(val)}
              disabled={verifyLoading}
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
          </div>
          <Button type="submit" className="w-full" disabled={verifyLoading}>
            {verifyLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify OTP
          </Button>
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              className="p-0 text-xs text-muted-foreground"
              disabled={sendLoading || verifyLoading}
              onClick={() => {
                if (emailCooldown > 0) {
                  toast.warning(`You can change email in ${emailCooldown}s`);
                  return;
                }
                setEmailOtpSent(false);
                setEmailOtp("");
              }}
            >
              Change email
            </Button>
            <Button
              type="button"
              variant="link"
              className="p-0 text-xs text-muted-foreground"
              onClick={handleSendEmailOtp}
              disabled={emailCooldown > 0 || sendLoading}
            >
              {sendLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {emailCooldown > 0 ? `Resend in ${emailCooldown}s` : "Resend OTP"}
            </Button>
          </div>
        </form>
      );
    }
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSendEmailOtp();
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="email-input" className="text-xs">
            Email Address
          </Label>
          <Input
            id="email-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sendLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={sendLoading}>
          {sendLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send OTP
        </Button>
      </form>
    );
  };

  const renderMobileForms = () => {
    if (phoneOtpSent) {
      return (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleVerifyMobileOtp();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-foreground">{phone}</span>
            </Label>
            <InputOTP
              autoFocus
              maxLength={6}
              value={phoneOtp}
              onChange={(val) => setPhoneOtp(val)}
              disabled={verifyLoading}
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
          </div>
          <Button type="submit" className="w-full" disabled={verifyLoading}>
            {verifyLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify OTP
          </Button>
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              className="p-0 text-xs text-muted-foreground"
              disabled={sendLoading || verifyLoading}
              onClick={() => {
                if (phoneCooldown > 0) {
                  toast.warning(`You can change phone in ${phoneCooldown}s`);
                  return;
                }
                setPhoneOtpSent(false);
                setPhoneOtp("");
              }}
            >
              Change phone
            </Button>
            <Button
              type="button"
              variant="link"
              className="p-0 text-xs text-muted-foreground"
              onClick={handleSendMobileOtp}
              disabled={phoneCooldown > 0 || sendLoading}
            >
              {sendLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {phoneCooldown > 0 ? `Resend in ${phoneCooldown}s` : "Resend OTP"}
            </Button>
          </div>
        </form>
      );
    }
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSendMobileOtp();
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="phone-input" className="text-xs">
            Phone Number
          </Label>
          <Input
            id="phone-input"
            type="tel"
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={sendLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={sendLoading}>
          {sendLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send OTP
        </Button>
      </form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <LogIn className="mr-2 h-4 w-4" />
          <span className="max-sm:sr-only">Sign In</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-1rem)] space-y-6 sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Welcome
          </DialogTitle>
          <DialogDescription>
            Sign in to continue to your account.
          </DialogDescription>
        </DialogHeader>
        <Button
          variant="outline"
          className="w-full font-semibold"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
        >
          {googleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue with Google
        </Button>
        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
            or
          </span>
        </div>
        <div className="space-y-4">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="mt-4">
              {renderEmailForms()}
            </TabsContent>
            <TabsContent value="mobile" className="mt-4">
              {renderMobileForms()}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
