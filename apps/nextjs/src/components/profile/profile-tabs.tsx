import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import UserFavoritesGrid from "./user-favourites-grid";
import UserListingsGrid from "./user-listings-grid";

export default function ProfileTabs({
  user,
}: {
  user: {
    id: string;
    listings: {
      price: number;
      status:
        | "pending_review"
        | "draft"
        | "active"
        | "sold"
        | "expired"
        | "archived"
        | "rejected"
        | "deleted";
      id: string;
      title: string;
      category: string | null;
      city: string | null;
      createdAt: Date;
      imageUrl: string | null;
    }[];
    favourites: {
      id: string;
      title: string;
      price: number;
      imageUrl: string | null;
    }[];
  };
}) {
  return (
    <Tabs defaultValue="listings" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
        <TabsTrigger value="listings">My Listings</TabsTrigger>
        <TabsTrigger value="favorites">Favourites</TabsTrigger>
      </TabsList>
      <TabsContent value="listings" className="mt-6">
        <UserListingsGrid listings={user.listings} />
      </TabsContent>

      <TabsContent value="favorites" className="mt-6">
        <UserFavoritesGrid favourites={user.favourites} />
      </TabsContent>
    </Tabs>
  );
}
