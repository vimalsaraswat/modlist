import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "@acme/ui";
import { ThemeProvider } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? `https://${env.VERCEL_URL}`
      : "http://localhost:3000",
  ),
  title: "ModList",
  description:
    "The ultimate marketplace for car modifications and performance parts. Buy and sell with confidence.",
  keywords: [
    "car mods India",
    "performance parts marketplace",
    "buy car parts online",
    "tuner car parts",
    "used car mods",
    "automotive marketplace India",
    "car modification",
    "ModList waitlist",
  ],

  // Open Graph (Social: Facebook, LinkedIn, etc.)
  openGraph: {
    title: "ModList",
    description:
      "India’s first marketplace for car mods & performance parts is launching soon. Join the waitlist for early access.",
    // url: "https://www.modlist.shop ",
    url: "https://modlist-nextjs.vercel.app",
    siteName: "ModList",
    // images: [
    //   {
    //     url: "/api/og/waitlist", // Optional: Dynamic OG image (see below)
    //     width: 1200,
    //     height: 630,
    //     alt: "ModList Waitlist – Be the first to mod smarter.",
    //   },
    // ],
    type: "website",
  },

  // Twitter
  twitter: {
    // card: "",
    // site: "@modlist_in",
    // creator: "@modlist_in",
    title: "ModList",
    description:
      "India’s car mod marketplace is coming. Join now for early access & exclusive perks.",
    // images: "/api/og/waitlist", // Same as openGraph image
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className="no-scrollbar" suppressHydrationWarning>
      <body
        className={cn(
          "no-scrollbar h-dvh overflow-auto bg-background font-sans text-foreground antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TRPCReactProvider>
            {props.children}
            <Toaster richColors />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
