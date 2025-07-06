import React from "react";
import { Badge, Car, Cpu, Disc, Gauge, Wrench, Zap } from "lucide-react";

import { Card, CardContent } from "@acme/ui/card";

const categories = [
  {
    icon: Zap,
    name: "Performance",
    description: "Turbo kits, intakes, exhausts",
    count: "2,450",
    variant: "performance" as const,
  },
  {
    icon: Disc,
    name: "Wheels & Tires",
    description: "Rims, tires, spacers",
    count: "3,120",
    variant: "wheels" as const,
  },
  {
    icon: Wrench,
    name: "Engine Parts",
    description: "Pistons, cams, headers",
    count: "1,890",
    variant: "engine" as const,
  },
  {
    icon: Car,
    name: "Body & Aero",
    description: "Spoilers, bumpers, kits",
    count: "1,560",
    variant: "body" as const,
  },
  {
    icon: Gauge,
    name: "Interior",
    description: "Seats, gauges, steering",
    count: "980",
    variant: "interior" as const,
  },
  {
    icon: Cpu,
    name: "Electronics",
    description: "ECUs, wiring, sensors",
    count: "750",
    variant: "electronics" as const,
  },
];

const CategoryShowcase = () => {
  return (
    <section className="bg-zinc-900 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="animate-slide-up mb-16 text-center">
          <h2 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            Find your{" "}
            <span className="neon-text text-orange-400">perfect part</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-zinc-400">
            Browse thousands of quality used parts from fellow enthusiasts. From
            daily drivers to track builds, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Card
              key={category.name}
              className="tuner-glow animate-slide-up group cursor-pointer border-zinc-700/50 bg-zinc-800/50 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-zinc-800/70"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="relative overflow-hidden p-8">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 transition-all duration-300 group-hover:from-orange-500/10 group-hover:to-red-500/10" />

                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                    <category.icon className="text-white" size={28} />
                  </div>

                  <h3 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-orange-400">
                    {category.name}
                  </h3>

                  <p className="mb-4 leading-relaxed text-zinc-400">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge>{category.count} listings</Badge>
                    <div className="text-zinc-400 transition-colors duration-300 group-hover:translate-x-1 group-hover:text-orange-400">
                      →
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div
          className="animate-slide-up mt-16 text-center"
          style={{ animationDelay: "0.6s" }}
        >
          <button className="rounded-full bg-orange-500 px-8 py-4 text-lg font-medium text-white transition-colors duration-300 hover:scale-105 hover:bg-orange-600">
            Browse All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
