import ProfileHeader from "~/components/profile/profile-header";
import ProfileTabs from "~/components/profile/profile-tabs";
import { api, HydrateClient } from "~/trpc/server";

export default async function ProfilePage() {
  const trpc = await api();
  const user = await trpc.auth.getUserData();

  return (
    <HydrateClient>
      <main className="min-h-dvh bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <ProfileHeader user={user} />
          <ProfileTabs user={user} />
        </div>
      </main>
    </HydrateClient>
  );
}
