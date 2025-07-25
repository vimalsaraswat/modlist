import { Clock, ShieldCheck, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";

export default function ProfileHeader({
  user,
}: {
  user: {
    id: string;
    name: string;
    image: string | null;
    // city: string;
    createdAt: Date;
    isVerified: boolean;
    totalListings: number;
    totalFavourites: number;
    averageRating: number;
  };
}) {
  return (
    <div className="mb-8 rounded-xl border border-border bg-card/60 p-6 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <Avatar className="h-20 w-20 ring-4 ring-primary/20">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>
            <User className="h-10 w-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            {user.isVerified && (
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
            {/* <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{user.city}</span>
            </div> */}
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>Member since {user.createdAt.getFullYear()}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3 sm:mt-0">
          <Badge variant="outline" className="px-3 py-1.5">
            📦 {user.totalListings} Listings
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5">
            ⭐ {user.totalFavourites} Favourites
          </Badge>
        </div>
      </div>
    </div>
  );
}
