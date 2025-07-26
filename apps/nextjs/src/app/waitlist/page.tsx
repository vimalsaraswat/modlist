import type { Metadata } from "next";

import Waitlist from "~/components/waitlist-page";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.modlist.shop"),

  // Primary SEO
  title: "Join the Waitlist | ModList – India’s Car Mods Marketplace",
  description:
    "Be first in line for India’s dedicated marketplace for car mods, performance parts, and tuner culture. No spam. Early access guaranteed.",
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
    title: "Join the Waitlist – ModList",
    description:
      "India’s first marketplace for car mods & performance parts is launching soon. Join the waitlist for early access.",
    url: "https://www.modlist.shop ",
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
    // card: "summary_large_image",
    // site: "@modlist_in",
    // creator: "@modlist_in",
    title: "Join the Waitlist | ModList",
    description:
      "India’s car mod marketplace is coming. Join now for early access & exclusive perks.",
    // images: "/api/og/waitlist", // Same as openGraph image
  },

  // Additional SEO
  // robots: {
  //   index: true,
  //   follow: true,
  // },

  // PWA / Theme
  // themeColor: "#ec4899", // Matches your primary (pink)
  // verification: {
  //   google: "your-google-site-verification-code", // Optional: Add if you have it
  // },
};

export default function WaitlistPage() {
  return <Waitlist />;
}
