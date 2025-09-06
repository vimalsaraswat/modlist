import { Clock, Mail, MapPin, ShieldCheck } from "lucide-react";

import { Badge } from "@acme/ui/badge";

import SignOutButton from "../auth/sign-out-btn";
import UserAvatar from "../common/user-avatar";
import ProfileEditDialog from "./profile-edit-dialog";

export default function ProfileHeader({
  user,
}: {
  user: {
    city: string;
    bio: string;
    id: string;
    name: string;
    image: string | null;
    email: string;
    createdAt: Date;
    cityId: number | null;
    phoneNumberVerified: boolean;
    totalListings: number;
    totalFavourites: number;
  };
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/80 p-8 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        {/* Avatar */}
        <UserAvatar
          imageUrl={user.image}
          name={user.name}
          className="h-28 w-28 shadow-md ring-4 ring-primary/20"
        />

        {/* User Info */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          {/* Name + Badge */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-3xl font-semibold">{user.name}</h1>
            {user.phoneNumberVerified && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
              >
                <ShieldCheck className="h-4 w-4 text-primary" />
                Verified
              </Badge>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="max-w-2xl text-sm text-muted-foreground">
              {user.bio}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground sm:justify-start">
            <span className="flex items-center gap-2">
              <Mail size={14} /> {user.email}
            </span>
            {user.city && (
              <span className="flex items-center gap-2">
                <MapPin size={14} /> {user.city}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Clock size={14} /> Joined{" "}
              {new Date(user.createdAt).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2 sm:max-w-xs">
            <div className="rounded-lg border bg-background px-4 py-3 text-center shadow-sm">
              <p className="text-lg font-semibold">{user.totalListings}</p>
              <p className="text-xs text-muted-foreground">Listings</p>
            </div>
            <div className="rounded-lg border bg-background px-4 py-3 text-center shadow-sm">
              <p className="text-lg font-semibold">{user.totalFavourites}</p>
              <p className="text-xs text-muted-foreground">Favourites</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 sm:items-end">
          <ProfileEditDialog user={user} />
          <SignOutButton />
        </div>
      </div>
    </section>
  );
}
