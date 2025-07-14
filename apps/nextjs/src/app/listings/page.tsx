import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import {
  ListingGrid,
  ListingGridSkeleton,
} from "../_components/listings/listing-grid";
import SearchListings from "../_components/listings/search-listings";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    make?: string;
    query?: string;
  }>;
}) {
  const { category, make, query } = await searchParams;
  const categoryId =
    category && !isNaN(Number(category)) ? Number(category) : undefined;
  const makeId = make && !isNaN(Number(make)) ? Number(make) : undefined;

  prefetch(
    trpc.listing.list.queryOptions({
      limit: 20,
      offset: 0,
      categoryId,
      makeId,
      keyword: query,
    }),
  );

  return (
    <HydrateClient>
      <main className="min-h-screen bg-zinc-900 pt-20">
        {/* Hero Section */}
        <div className="garage-pattern relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-orange-900/30 py-16">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-orange-500/10 to-red-500/10"></div>
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-8 text-center">
              <h1 className="neon-text mb-4 text-5xl font-bold text-white md:text-6xl">
                Browse <span className="text-orange-400">Parts</span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-zinc-300">
                Find the perfect parts for your build from fellow enthusiasts
              </p>
            </div>

            {/* Search Bar */}
            <SearchListings />
          </div>
        </div>

        {/* Categories */}
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* <div className="mb-8 flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === "all" ? "tuner" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className="transition-all duration-300 hover:scale-105"
              >
                All Parts
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={
                    selectedCategory === category.name ? "tuner" : "outline"
                  }
                  onClick={() => setSelectedCategory(category.name)}
                  className="transition-all duration-300 hover:scale-105"
                >
                  <category.icon className="mr-2" size={16} />
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div> */}

          {/* Sort and Filter Bar */}
          <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* <div className="text-zinc-400">
                Showing {filteredListings.length} of {listings.length} listings
              </div>
              <div className="flex gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-zinc-700 bg-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-800">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-48 border-zinc-700 bg-zinc-800 text-white">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-800">
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-500">Under $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                    <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                    <SelectItem value="2000+">$2,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
          </div>

          {/* Listings Grid */}
          <Suspense fallback={<ListingGridSkeleton />}>
            <ListingGrid />
          </Suspense>

          {/* Load More */}
          {/* <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                className="border-zinc-600 text-white hover:bg-zinc-800"
              >
                Load More Listings
              </Button>
            </div> */}
        </div>
      </main>
    </HydrateClient>
  );
}
