import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "@acme/ui/button";

import ListingCard from "../listings/listing-card";

export default function UserListingsGrid({
  listings,
}: {
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
}) {
  if (listings.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card/30 p-12 text-center">
        <p className="text-muted-foreground">
          You haven’t listed any parts yet.
        </p>
        <div className="mt-4">
          <Button asChild variant="secondary">
            <Link href="/listings/new">
              <PlusIcon className="mr-2 size-5" /> List Your First Part
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          id={listing.id}
          city={listing.city}
          price={listing.price}
          title={listing.title}
          imageUrl={listing.imageUrl}
          category={listing.category}
          createdAt={listing.createdAt}
          status={listing.status}
        />
      ))}
    </div>
  );
}
