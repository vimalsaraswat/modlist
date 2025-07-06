import React from "react";
import { Clock, Heart, MapPin, Star } from "lucide-react";

const listings = [
  {
    id: 1,
    title: "Garrett GT2860RS Turbo Kit",
    price: "$2,850",
    originalPrice: "$4,200",
    location: "Toronto, ON",
    timeAgo: "2 hours ago",
    seller: "TurboMike92",
    rating: 4.9,
    image:
      "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400",
    condition: "Excellent",
    car: "2015 Subaru WRX STI",
    category: "Performance",
  },
  {
    id: 2,
    title: "Work Emotion CR Kiwami 18x9.5",
    price: "$1,200",
    originalPrice: "$2,800",
    location: "Vancouver, BC",
    timeAgo: "5 hours ago",
    seller: "WheelDealer",
    rating: 5.0,
    image:
      "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400",
    condition: "Good",
    car: "Universal Fitment",
    category: "Wheels",
  },
  {
    id: 3,
    title: "Recaro Sportster CS Seats",
    price: "$800",
    originalPrice: "$1,500",
    location: "Montreal, QC",
    timeAgo: "1 day ago",
    seller: "RaceReady",
    rating: 4.8,
    image:
      "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400",
    condition: "Very Good",
    car: "Universal",
    category: "Interior",
  },
  {
    id: 4,
    title: "HKS Hi-Power Exhaust System",
    price: "$650",
    originalPrice: "$1,200",
    location: "Calgary, AB",
    timeAgo: "2 days ago",
    seller: "ExhaustPro",
    rating: 4.7,
    image:
      "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400",
    condition: "Good",
    car: "2006-2011 Honda Civic Si",
    category: "Exhaust",
  },
];

const FeaturedListings = () => {
  return (
    <section className="bg-gradient-to-br from-zinc-800 to-zinc-900 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            Featured <span className="text-orange-400">listings</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-zinc-400">
            Hand-picked quality parts from trusted sellers in your area. These
            won't last long!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-xl transition-all duration-300 hover:bg-zinc-800/70"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-sm font-medium text-white">
                    {listing.category}
                  </span>
                </div>
                <div className="absolute right-4 top-4">
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 backdrop-blur-sm transition-colors hover:text-red-400">
                    <Heart size={16} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="rounded bg-green-500 px-2 py-1 text-xs font-medium text-white">
                    {listing.condition}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white">
                  {listing.title}
                </h3>

                <div className="mb-3 text-sm text-zinc-400">
                  Fits: {listing.car}
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-400">
                      {listing.price}
                    </div>
                    <div className="text-sm text-zinc-500 line-through">
                      {listing.originalPrice}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1 flex items-center space-x-1">
                      <Star
                        className="fill-current text-orange-400"
                        size={14}
                      />
                      <span className="text-sm font-medium text-white">
                        {listing.rating}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-400">
                      {listing.seller}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{listing.timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="rounded-full bg-orange-500 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-orange-600">
            View All Listings
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
