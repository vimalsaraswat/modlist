import ProfileHeader from "~/app/_components/profile/profile-header";
import { api, HydrateClient } from "~/trpc/server";
import ProfileTabs from "../_components/profile/profile-tabs";

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
