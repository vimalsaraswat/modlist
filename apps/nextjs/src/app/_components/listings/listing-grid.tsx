"use client";

import { useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Skeleton } from "@acme/ui/skeleton";

import { useTRPC } from "~/trpc/react";
import ListingCard from "./listing-card";

export function ListingGrid() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("query");
  const category = searchParams.get("category");
  const make = searchParams.get("make");
  const categoryId =
    category && !isNaN(Number(category)) && Number(category) >= 0
      ? Number(category)
      : undefined;
  const makeId =
    make && !isNaN(Number(make)) && Number(make) >= 0
      ? Number(make)
      : undefined;

  const { data: listings = [] } = useSuspenseQuery(
    trpc.listing.list.queryOptions({
      limit: 20,
      offset: 0,
      categoryId,
      makeId,
      keyword:
        typeof searchQuery === "string" && searchQuery !== ""
          ? searchQuery
          : undefined,
    }),
  );

  if (listings.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((item) => (
        <ListingCard
          key={item.id}
          id={item.id}
          city={item.city}
          price={item.price}
          title={item.title}
          imageUrl={item.imageUrl}
          category={item.category}
          createdAt={item.createdAt}
          description={item.description}
        />
      ))}
    </div>
  );
}

export function ListingGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-64 animate-pulse" />
      ))}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-gray-500">
      <p className="text-2xl font-bold">No listings found.</p>
    </div>
  );
}
