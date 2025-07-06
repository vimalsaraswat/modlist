import React from "react";
import { MapPin, TrendingUp } from "lucide-react";

const cities = [
  {
    name: "Toronto",
    province: "ON",
    listings: "4,250",
    growth: "+12%",
    popular: ["Turbo kits", "Wheels", "Exhausts"],
    image:
      "https://images.pexels.com/photos/374710/pexels-photo-374710.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Vancouver",
    province: "BC",
    listings: "3,180",
    growth: "+8%",
    popular: ["JDM parts", "Coilovers", "Body kits"],
    image:
      "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Montreal",
    province: "QC",
    listings: "2,890",
    growth: "+15%",
    popular: ["Euro parts", "Intakes", "Seats"],
    image:
      "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Calgary",
    province: "AB",
    listings: "1,950",
    growth: "+20%",
    popular: ["Truck parts", "Lift kits", "Tires"],
    image:
      "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const LocationFeed = () => {
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
              className="group cursor-pointer overflow-hidden rounded-3xl border border-zinc-700/50 bg-zinc-900/50 backdrop-blur-xl transition-all duration-300 hover:bg-zinc-900/70"
            >
              {/* City Image */}
              <div className="relative h-32 overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2 text-white">
                    <MapPin size={16} />
                    <span className="font-semibold">
                      {city.name}, {city.province}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
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

        {/* <div className="mt-16 text-center">
          <div className="mx-auto max-w-md rounded-2xl border border-zinc-700/50 bg-zinc-900/50 p-6 backdrop-blur-xl">
            <Clock className="mx-auto mb-4 text-orange-400" size={32} />
            <h3 className="mb-2 text-xl font-bold text-white">
              Don't see your city?
            </h3>
            <p className="mb-4 text-sm text-zinc-400">
              We're expanding across Canada. Join the waitlist to be notified
              when we launch in your area.
            </p>
            <button className="rounded-full bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600">
              Join Waitlist
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default LocationFeed;
