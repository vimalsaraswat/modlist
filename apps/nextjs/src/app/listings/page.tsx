import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import Filters from "../_components/listings/filters";
import {
  ListingGrid,
  ListingGridSkeleton,
} from "../_components/listings/listing-grid";
import Search from "../_components/listings/search";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    make?: string;
    city?: string;
    query?: string;
  }>;
}) {
  const { category, make, query, city } = await searchParams;
  const categoryId =
    category && !isNaN(Number(category)) ? Number(category) : undefined;
  const makeId = make && !isNaN(Number(make)) ? Number(make) : undefined;
  const cityId = city && !isNaN(Number(city)) ? Number(city) : undefined;

  prefetch(
    trpc.listing.list.queryOptions({
      limit: 20,
      offset: 0,
      categoryId,
      makeId,
      cityId,
      keyword: query,
    }),
  );

  return (
    <HydrateClient>
      <main className="no-scrollbar mx-auto flex max-h-[calc(100vh-4rem)] flex-col gap-4 overflow-auto px-6 py-8 lg:flex-row">
        {/* Sort and Filter Bar */}
        <div className="top-0 flex gap-2 lg:sticky lg:min-w-96 lg:flex-col">
          <div className="max-lg:flex-1">
            <Search />
          </div>
          <div>
            <Filters />
          </div>
        </div>
        {/* Listings Grid */}
        <div className="flex-1">
          <Suspense fallback={<ListingGridSkeleton />}>
            <ListingGrid />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
