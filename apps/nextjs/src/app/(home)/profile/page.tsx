import { notFound } from "next/navigation";

import { getSession } from "~/auth/server";
import ProfileHeader from "~/components/profile/profile-header";
import ProfileTabs from "~/components/profile/profile-tabs";
import { api, HydrateClient } from "~/trpc/server";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user) notFound();

  const trpc = await api();

  const [profile, listings, favourites] = await Promise.all([
    trpc.auth.getUserProfile(),
    trpc.auth.getUserListings({ limit: 50 }),
    trpc.auth.getUserFavourites(),
  ]);

  return (
    <HydrateClient>
      <main className="min-h-dvh bg-background">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-12">
          {/* Profile header (avatar, name, stats) */}
          <ProfileHeader
            user={{
              ...profile,
              totalListings: listings.length,
              totalFavourites: favourites.length,
            }}
          />

          {/* Tabs: Listings / Favourites */}
          <ProfileTabs
            user={{
              id: profile.id,
              listings,
              favourites,
            }}
          />
        </div>
      </main>
    </HydrateClient>
  );
}
