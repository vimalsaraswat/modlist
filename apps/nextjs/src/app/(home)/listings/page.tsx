import { Suspense } from "react";

import Filters from "~/components/listings/filters";
import {
  InitialSkeleton,
  ListingGrid,
} from "~/components/listings/listing-grid";
import Search from "~/components/listings/search";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    make?: string;
    city?: string;
    query?: string;
    model?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const { category, make, model, city, minPrice, maxPrice, query } =
    await searchParams;

  const categoryId =
    category && !isNaN(Number(category)) ? Number(category) : undefined;
  const makeId = make && !isNaN(Number(make)) ? Number(make) : undefined;
  const modelId = model && !isNaN(Number(model)) ? Number(model) : undefined;
  const cityId = city && !isNaN(Number(city)) ? Number(city) : undefined;

  prefetch(
    trpc.listing.list.infiniteQueryOptions({
      limit: 20,
      categoryId,
      makeId,
      modelId,
      cityId,
      priceMin: minPrice ? Number(minPrice) : undefined,
      priceMax: maxPrice ? Number(maxPrice) : undefined,
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
          <Suspense fallback={<InitialSkeleton />}>
            <ListingGrid />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
