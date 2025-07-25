import React from "react";
import { MapPin, TrendingUp } from "lucide-react";

const cities = [
  {
    name: "Delhi",
    listings: "4,250",
    growth: "+12%",
    popular: ["Turbo kits", "Wheels", "Exhausts"],
  },
  {
    name: "Mumbai",
    listings: "3,180",
    growth: "+8%",
    popular: ["JDM parts", "Coilovers", "Body kits"],
  },
  {
    name: "Bangalore",
    listings: "2,890",
    growth: "+15%",
    popular: ["Euro parts", "Intakes", "Seats"],
  },
  {
    name: "Hyderabad",
    listings: "1,950",
    growth: "+20%",
    popular: ["Truck parts", "Lift kits", "Tires"],
  },
];

export default function LocationFeed() {
  return (
    <section className="bg-zinc-800 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            Local <span className="text-orange-400">marketplaces</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-zinc-400">
            Find parts in your city. Support local sellers and avoid shipping
            costs with face-to-face transactions.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cities.map((city, index) => (
            <div
              key={index}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-zinc-700/50 bg-zinc-900/50 backdrop-blur-xl transition-all hover:bg-zinc-900/70"
            >
              <div className="relative h-32 overflow-hidden bg-gradient-to-r from-orange-500 to-red-600">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2 text-white">
                    <MapPin size={16} />
                    <span className="font-semibold">{city.name}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-400">
                      {city.listings}
                    </div>
                    <div className="text-sm text-zinc-400">Active listings</div>
                  </div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <TrendingUp size={16} />
                    <span className="font-semibold">{city.growth}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="mb-2 text-sm font-semibold text-white">
                    Popular this week:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {city.popular.map((item, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full rounded-xl border border-orange-500/30 bg-orange-500/10 py-3 font-medium text-orange-400 transition-colors hover:bg-orange-500/20">
                  Browse {city.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
