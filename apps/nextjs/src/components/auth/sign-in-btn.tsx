// "use client";

// import { useState } from "react";
// import { usePathname } from "next/navigation";
// import { Loader2, LogIn, Mail, Phone } from "lucide-react";

// import { Button } from "@acme/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@acme/ui/dialog";
// import { Input } from "@acme/ui/input";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@acme/ui/input-otp";
// import { Label } from "@acme/ui/label";
// import { RadioGroup, RadioGroupItem } from "@acme/ui/radio-group";
// import { Separator } from "@acme/ui/separator";
// import { toast } from "@acme/ui/toast";

// import { signIn } from "~/actions/auth";
// import { authClient } from "~/auth/client";

// export default function SignInDialog() {
//   const pathName = usePathname();
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // otp mode (email or mobile)
//   const [otpMode, setOtpMode] = useState<"email" | "mobile">("email");

//   // email
//   const [email, setEmail] = useState("");
//   const [emailOtp, setEmailOtp] = useState("");
//   const [emailStep, setEmailStep] = useState<"enter" | "verify">("enter");

//   // mobile
//   const [phone, setPhone] = useState("");
//   const [phoneOtp, setPhoneOtp] = useState("");
//   const [phoneStep, setPhoneStep] = useState<"enter" | "verify">("enter");

//   // ---- handlers ----
//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     try {
//       await signIn(pathName);
//     } catch {
//       toast.error("Google sign-in failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendEmailOtp = async () => {
//     try {
//       const { data, error } = await authClient.emailOtp.sendVerificationOtp({
//         email,
//         type: "sign-in",
//       });

//       console.log("handleSendEmailOtp", { data, error });

//       if (data) {
//         toast.success("OTP sent to email");
//         setEmailStep("verify");
//       }
//       if (error) {
//         toast.error(error.message);
//       }
//     } catch {
//       toast.error("Failed to send email OTP");
//     }
//   };

//   const handleVerifyEmailOtp = async () => {
//     try {
//       const { data, error } = await authClient.signIn.emailOtp({
//         email,
//         otp: emailOtp,
//         fetchOptions: {},
//       });
//       console.log("handleVerifyEmailOtp", { data, error });

//       // await verifyEmailOtp(email, emailOtp);
//       if (data) {
//         toast.success("Signed in with email OTP");
//         setOpen(false);
//       }
//       if (error) {
//         toast.error(error.message);
//       }
//     } catch {
//       toast.error("Invalid OTP");
//     }
//   };

//   // Send OTP
//   const handleSendMobileOtp = async () => {
//     try {
//       const { data, error } = await authClient.phoneNumber.sendOtp({
//         phoneNumber: phone,
//         // type: "sign-in",
//       });

//       console.log("handleSendMobileOtp", { data, error });

//       if (data) {
//         toast.success("OTP sent to mobile");
//         setPhoneStep("verify");
//       }
//       if (error) {
//         toast.error(error.message);
//       }
//     } catch {
//       toast.error("Failed to send mobile OTP");
//     }
//   };

//   // Verify OTP
//   const handleVerifyMobileOtp = async () => {
//     try {
//       const { data, error } = await authClient.phoneNumber.verify({
//         phoneNumber: phone,
//         code: phoneOtp,
//       });

//       console.log("handleVerifyMobileOtp", { data, error });

//       if (data) {
//         toast.success("Signed in with mobile OTP");
//         setOpen(false);
//       }
//       if (error) {
//         toast.error(error.message);
//       }
//     } catch {
//       toast.error("Invalid OTP");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <LogIn className="mr-2 h-4 w-4" />
//           Sign In
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="space-y-2 sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold">
//             Welcome back
//           </DialogTitle>
//           <DialogDescription>
//             Sign in with Google or using OTP (Email or Mobile).
//           </DialogDescription>
//         </DialogHeader>

//         {/* Google */}
//         <Button
//           className="w-full"
//           onClick={handleGoogleSignIn}
//           disabled={loading}
//         >
//           {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//           Continue with Google
//         </Button>

//         <Separator />

//         {/* OTP Sign In */}
//         <div className="space-y-3">
//           <Label className="text-sm font-medium">Sign in with OTP</Label>
//           <RadioGroup
//             value={otpMode}
//             onValueChange={(v) => setOtpMode(v as "email" | "mobile")}
//             className="flex gap-4"
//           >
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="email" id="email" />
//               <Label htmlFor="email">Email</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="mobile" id="mobile" />
//               <Label htmlFor="mobile">Mobile</Label>
//             </div>
//           </RadioGroup>

//           {otpMode === "email" ? (
//             emailStep === "enter" ? (
//               <form className="space-y-2" action={handleSendEmailOtp}>
//                 <Input
//                   type="email"
//                   placeholder="you@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <Button type="submit" className="w-full">
//                   <Mail className="mr-2 h-4 w-4" />
//                   Send OTP
//                 </Button>
//               </form>
//             ) : (
//               <form className="space-y-2" action={handleVerifyEmailOtp}>
//                 <InputOTP
//                   autoFocus
//                   maxLength={6}
//                   value={emailOtp}
//                   onChange={(val) => setEmailOtp(val)}
//                 >
//                   <InputOTPGroup>
//                     <InputOTPSlot index={0} />
//                     <InputOTPSlot index={1} />
//                     <InputOTPSlot index={2} />
//                   </InputOTPGroup>
//                   <InputOTPSeparator />
//                   <InputOTPGroup>
//                     <InputOTPSlot index={3} />
//                     <InputOTPSlot index={4} />
//                     <InputOTPSlot index={5} />
//                   </InputOTPGroup>
//                 </InputOTP>
//                 <Button className="w-full">Verify OTP</Button>
//               </form>
//             )
//           ) : phoneStep === "enter" ? (
//             <form className="space-y-2" action={handleSendMobileOtp}>
//               <Input
//                 placeholder="9876543210"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//               />
//               <Button type="submit" className="w-full">
//                 <Phone className="mr-2 h-4 w-4" />
//                 Send OTP
//               </Button>
//             </form>
//           ) : (
//             <form className="space-y-2" action={handleVerifyMobileOtp}>
//               <InputOTP
//                 autoFocus
//                 value={phoneOtp}
//                 onChange={(val) => setPhoneOtp(val)}
//                 maxLength={6}
//               >
//                 <InputOTPGroup>
//                   <InputOTPSlot index={0} />
//                   <InputOTPSlot index={1} />
//                   <InputOTPSlot index={2} />
//                 </InputOTPGroup>
//                 <InputOTPSeparator />
//                 <InputOTPGroup>
//                   <InputOTPSlot index={3} />
//                   <InputOTPSlot index={4} />
//                   <InputOTPSlot index={5} />
//                 </InputOTPGroup>
//               </InputOTP>

//               <Button type="submit" className="w-full">
//                 Verify OTP
//               </Button>
//             </form>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
import { RadioGroup, RadioGroupItem } from "@acme/ui/radio-group";
import { Separator } from "@acme/ui/separator";
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
  const [sendEmailLoading, setSendEmailLoading] = useState(false);
  const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);
  const [sendPhoneLoading, setSendPhoneLoading] = useState(false);
  const [verifyPhoneLoading, setVerifyPhoneLoading] = useState(false);

  const [otpMode, setOtpMode] = useState<"email" | "mobile">("email");

  // Email states
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailStep, setEmailStep] = useState<"enter" | "verify">("enter");
  const [emailCooldown, setEmailCooldown] = useState(0);

  // Phone states
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneStep, setPhoneStep] = useState<"enter" | "verify">("enter");
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

  // Google Sign In
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

  // Email OTP
  const handleSendEmailOtp = async () => {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    if (sendEmailLoading) return;
    setSendEmailLoading(true);
    try {
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      if (data) {
        toast.success("OTP sent to email");
        setEmailStep("verify");
        setEmailCooldown(60);
      }
      if (error) toast.error(error.message);
    } catch {
      toast.error("Failed to send email OTP");
    } finally {
      setSendEmailLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    const result = otpSchema.safeParse(emailOtp);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid OTP");
      return;
    }

    if (verifyEmailLoading) return;
    setVerifyEmailLoading(true);
    try {
      const { data, error } = await authClient.signIn.emailOtp({
        email,
        otp: emailOtp,
      });
      if (data) {
        toast.success("Signed in with email OTP");
        window.location.reload();
        setOpen(false);
      }
      if (error) toast.error(error.message);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setVerifyEmailLoading(false);
    }
  };

  // Mobile OTP
  const handleSendMobileOtp = async () => {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid phone number");
      return;
    }
    if (sendPhoneLoading) return;

    setSendPhoneLoading(true);
    try {
      const { data, error } = await authClient.phoneNumber.sendOtp({
        phoneNumber: phone,
      });
      if (data) {
        toast.success("OTP sent to mobile");
        setPhoneStep("verify");
        setPhoneCooldown(60);
      }
      if (error) toast.error(error.message);
    } catch {
      toast.error("Failed to send mobile OTP");
    } finally {
      setSendPhoneLoading(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    const result = otpSchema.safeParse(phoneOtp);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid OTP");
      return;
    }
    if (verifyPhoneLoading) return;
    setVerifyPhoneLoading(true);
    try {
      const { data, error } = await authClient.phoneNumber.verify({
        phoneNumber: phone,
        code: phoneOtp,
      });
      if (data) {
        toast.success("Signed in with mobile OTP");
        window.location.reload();
        setOpen(false);
      }
      if (error) toast.error(error.message);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setVerifyPhoneLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Welcome back
          </DialogTitle>
          <DialogDescription>
            Sign in with Google or using OTP (Email or Mobile).
          </DialogDescription>
        </DialogHeader>

        {/* Google Sign In */}
        <Button
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
        >
          {googleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue with Google
        </Button>

        <Separator />

        <div className="space-y-4">
          <Label className="text-sm font-medium">Sign in with OTP</Label>
          <RadioGroup
            value={otpMode}
            onValueChange={(v) => setOtpMode(v as "email" | "mobile")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mobile" id="mobile" />
              <Label htmlFor="mobile">Mobile</Label>
            </div>
          </RadioGroup>

          {/* Email OTP flow */}
          {otpMode === "email" ? (
            emailStep === "enter" ? (
              <form
                className="space-y-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleSendEmailOtp();
                }}
              >
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={sendEmailLoading || emailCooldown > 0}
                >
                  {sendEmailLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : emailCooldown > 0 ? (
                    `Resend OTP in ${emailCooldown}s`
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            ) : (
              <form
                className="space-y-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleVerifyEmailOtp();
                }}
              >
                <InputOTP
                  autoFocus
                  maxLength={6}
                  value={emailOtp}
                  onChange={(val) => setEmailOtp(val)}
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={verifyEmailLoading}
                >
                  {verifyEmailLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Verify OTP
                </Button>
                <Button
                  variant="link"
                  className="w-full text-sm"
                  onClick={() => setEmailStep("enter")}
                >
                  Change Email
                </Button>
              </form>
            )
          ) : phoneStep === "enter" ? (
            <form
              className="space-y-2"
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSendMobileOtp();
              }}
            >
              <Input
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={sendPhoneLoading || phoneCooldown > 0}
              >
                {sendPhoneLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : phoneCooldown > 0 ? (
                  `Resend OTP in ${phoneCooldown}s`
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          ) : (
            <form
              className="space-y-2"
              onSubmit={async (e) => {
                e.preventDefault();
                await handleVerifyMobileOtp();
              }}
            >
              <InputOTP
                autoFocus
                value={phoneOtp}
                onChange={(val) => setPhoneOtp(val)}
                maxLength={6}
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
              <Button
                type="submit"
                className="w-full"
                disabled={verifyPhoneLoading}
              >
                {verifyPhoneLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Verify OTP
              </Button>
              <Button
                variant="link"
                className="w-full text-sm"
                onClick={() => setPhoneStep("enter")}
              >
                Change Phone
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
