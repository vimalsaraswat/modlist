import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "@acme/ui";
import { ThemeProvider, ThemeToggle } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";
import Header from "./_components/header";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://modlist-nextjs.vercel.app"
      : "http://localhost:3000",
  ),
  title: "ModList",
  description:
    "The ultimate marketplace for car modifications and performance parts. Buy and sell with confidence.",
  keywords:
    "car parts, automotive, tuning, modifications, performance, marketplace",
  openGraph: {
    title: "ModList",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://modlist-nextjs.vercel.app",
    siteName: "ModList",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
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
            <Header />
            {props.children}
          </TRPCReactProvider>
          <div className="fixed bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
