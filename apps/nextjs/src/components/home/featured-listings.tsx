// /app/_components/home/featured-listings.tsx

"use client";

// import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

import { Button } from "@acme/ui/button";

const listings = [
  {
    id: 1,
    title: "Garrett GT2860RS Turbo Kit",
    price: "₹1,20,000",
    originalPrice: "₹1,80,000",
    location: "Mumbai",
    seller: "TunerRaj",
    rating: 4.9,
    image: "https://picsum.photos/400/300?random=1",
    car: "Honda Civic FD2",
  },
  {
    id: 2,
    title: "BBS RS-GT 18x9.5",
    price: "₹45,000",
    originalPrice: "₹70,000",
    location: "Delhi",
    seller: "WheelWala",
    rating: 5.0,
    image: " https://picsum.photos/400/300?random=2",
    car: "Universal Fitment",
  },
  {
    id: 3,
    title: "Recaro Sportster Seats",
    price: "₹25,000",
    originalPrice: "₹40,000",
    location: "Bangalore",
    seller: "RaceReady",
    rating: 4.8,
    image: " https://picsum.photos/400/300?random=3",
    car: "Universal",
  },
  {
    id: 4,
    title: "HKS Hi-Power Exhaust",
    price: "₹18,000",
    originalPrice: "₹25,000",
    location: "Hyderabad",
    seller: "ExhaustKing",
    rating: 4.7,
    image: " https://picsum.photos/400/300?random=4",
    car: "Honda Civic Si",
  },
];

export default function FeaturedListings() {
  return (
    <section className="bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Featured <span className="text-orange-400">Listings</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            Handpicked parts from trusted sellers across India. Limited stock!
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="group overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/50 transition-all duration-300 hover:border-orange-500/50"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute right-2 top-2">
                  <button className="rounded-full bg-zinc-900/70 p-1.5 text-zinc-400 transition-colors hover:text-red-500">
                    <Heart size={16} />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 rounded bg-orange-500 px-2 py-0.5 text-xs text-white">
                  {listing.location}
                </div>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 text-lg font-semibold text-white">
                  {listing.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">{listing.car}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-orange-400">
                      {listing.price}
                    </div>
                    <del className="text-xs text-zinc-500">
                      {listing.originalPrice}
                    </del>
                  </div>
                  <div className="flex items-center gap-1 text-orange-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-medium">
                      {listing.rating}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-zinc-500">
                  Seller: <span className="text-white">{listing.seller}</span>
                </div>
                <div className="mt-4">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                  >
                    <Link href={`/listing/${listing.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link href="/listings">Browse All Listings</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
