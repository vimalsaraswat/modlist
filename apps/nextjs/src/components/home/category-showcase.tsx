// /app/_components/home/category-showcase.tsx

"use client";

import Link from "next/link";
import { Car, Cpu, Disc, Gauge, Settings, Wrench, Zap } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";

const categories = [
  {
    icon: Zap,
    name: "Performance",
    description: "Turbo kits, intakes, exhausts",
    count: "2,450",
  },
  {
    icon: Disc,
    name: "Wheels & Tires",
    description: "Rims, tires, spacers",
    count: "3,120",
  },
  {
    icon: Wrench,
    name: "Engine Parts",
    description: "Pistons, cams, headers",
    count: "1,890",
  },
  {
    icon: Car,
    name: "Body & Aero",
    description: "Spoilers, bumpers, kits",
    count: "1,560",
  },
  {
    icon: Gauge,
    name: "Interior",
    description: "Seats, gauges, steering",
    count: "980",
  },
  {
    icon: Settings,
    name: "Suspension",
    description: "Coilovers, shocks, bushings",
    count: "1,230",
  },
  {
    icon: Cpu,
    name: "Electronics",
    description: "ECUs, wiring, sensors",
    count: "750",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Popular <span className="text-accent">Categories</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Browse thousands of quality used car parts from sellers across
            India.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="group transition-all duration-300 hover:bg-card/70"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition-transform group-hover:scale-110">
                    <category.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-zinc-400">{category.description}</p>
                    <div className="mt-3 text-sm font-medium text-orange-400">
                      {category.count} listings
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" asChild variant="outline">
            <Link href="/listings">Browse All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
