"use client";

import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";

// import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
// import { Badge } from "@acme/ui/badge";
import { Card, CardContent } from "@acme/ui/card";

import { useTRPC } from "~/trpc/react";

export function ListingGrid() {
  const trpc = useTRPC();
  const { data: listings = [] } = useSuspenseQuery(
    trpc.listing.list.queryOptions({ limit: 20, offset: 0 }),
  );

  if (listings.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((item) => (
        <Link key={item.id} href={`/listing/${item.id}`}>
          <Card
            className={`group cursor-pointer border-zinc-700/50 bg-zinc-800/50 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-zinc-800/70`}
            //   ${
            //   false ? "tuner-glow ring-2 ring-orange-400/50" : ""
            // }
          >
            <div className="relative overflow-hidden rounded-t-lg">
              {item.imageUrl && (
                <img
                  height={20}
                  width={20}
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              )}
              {/* {false && (
                <Badge className="absolute left-3 top-3">Featured</Badge>
              )} */}
              {/* <Badge
                variant={
                  listing.category === "Performance"
                    ? "performance"
                    : listing.category === "Wheels & Tires"
                      ? "wheels"
                      : listing.category === "Engine Parts"
                        ? "engine"
                        : listing.category === "Interior"
                          ? "interior"
                          : "electronics"
                }
                className="absolute right-3 top-3"
              >
                {listing.category}
              </Badge> */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute bottom-3 right-3 bg-zinc-900/80 text-zinc-400 backdrop-blur-sm hover:bg-zinc-900 hover:text-red-400"
              >
                {/* <HeartIcon size={16} /> */}
              </Button>
              {/* <Badge
                variant={
                  listing.condition === "Excellent"
                    ? "performance"
                    : listing.condition === "Very Good"
                      ? "wheels"
                      : listing.condition === "Good"
                        ? "engine"
                        : "outline"
                }
                className="absolute bottom-3 left-3"
              >
                {listing.condition}
              </Badge> */}
            </div>

            <CardContent className="p-4">
              <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-orange-400">
                {item.title}
              </h3>

              <div className="mb-3 text-sm text-zinc-400">
                {/* Fits: {listing.car} */}
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-400">
                    ${item.price.toLocaleString()}
                  </div>
                  {/* {listing.originalPrice && (
                    <div className="text-sm text-zinc-500 line-through">
                      ${listing.originalPrice.toLocaleString()}
                    </div>
                  )} */}
                </div>
                <div className="text-right">
                  {/* <div className="mb-1 flex items-center space-x-1">
                    <Star className="fill-current text-orange-400" size={14} />
                    <span className="text-sm font-medium text-white">
                      {listing.rating}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-400">{listing.seller}</div> */}
                </div>
              </div>

              <p className="mb-4 line-clamp-2 text-sm text-zinc-400">
                {item.description}
              </p>

              <div className="mb-4 flex items-center justify-between text-sm text-zinc-400">
                <div className="flex items-center space-x-1">
                  {/* <MapPin size={14} /> */}
                  {/* <span>{item.location}</span> */}
                </div>
                <div className="flex items-center space-x-1">
                  {/* <Clock size={14} /> */}
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <Button className="w-full">
                {/* <MessageCircle className="mr-2" size={16} /> */}
                Message Seller
              </Button>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function ListingGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-64 animate-pulse bg-gray-200" />
      ))}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-16 text-gray-500">
      <p className="text-2xl font-bold">No listings found.</p>
    </div>
  );
}
