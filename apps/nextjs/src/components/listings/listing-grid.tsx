"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import { Skeleton } from "@acme/ui/skeleton";

import { useTRPC } from "~/trpc/react";
import ListingCard from "./listing-card";

export function ListingGrid() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const parsedParams = useMemo(() => {
    const parseNumericParam = (param: string | null) =>
      param && !isNaN(Number(param)) && Number(param) >= 0
        ? Number(param)
        : undefined;

    const parseStringParam = (param: string | null) =>
      typeof param === "string" && param.trim() !== "" ? param : undefined;

    return {
      categoryId: parseNumericParam(searchParams.get("category")),
      makeId: parseNumericParam(searchParams.get("make")),
      modelId: parseNumericParam(searchParams.get("model")),
      modificationId: parseNumericParam(searchParams.get("modification")),
      year: parseNumericParam(searchParams.get("year")),
      cityId: parseNumericParam(searchParams.get("city")),
      priceMin: parseNumericParam(searchParams.get("minPrice")),
      priceMax: parseNumericParam(searchParams.get("maxPrice")),
      keyword: parseStringParam(searchParams.get("query")),
    };
  }, [searchParams]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
    isError,
  } = useSuspenseInfiniteQuery(
    trpc.listing.list.infiniteQueryOptions(
      {
        limit: 20,
        ...parsedParams,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  const listings = data.pages.flatMap((page) => page.items);

  // Infinite Scroll Handler
  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !isFetchingNextPage) {
          console.log("fetchNextPage");
          void fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "600px", // prefetch before appearing
        threshold: 0,
      },
    );

    observer.observe(loader);

    return () => {
      observer.unobserve(loader);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isInitialLoading) {
    return <InitialSkeleton />;
  }

  if (isError) {
    return <ErrorState />;
  }

  if (listings.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
        {listings.map((item, i) => (
          <ListingCard
            key={i}
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

      {hasNextPage && (
        <div
          ref={loaderRef}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3"
          aria-live="polite"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 animate-pulse" />
          ))}
        </div>
      )}
    </>
  );
}

export function InitialSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-64 animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-gray-500">
      <p className="text-2xl font-bold">No listings found.</p>
      <p className="mt-2 text-sm">
        Try adjusting your filters or search query.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-red-500">
      <p className="text-2xl font-bold">Something went wrong.</p>
      <p className="mt-2 text-sm">Please try refreshing the page.</p>
    </div>
  );
}
