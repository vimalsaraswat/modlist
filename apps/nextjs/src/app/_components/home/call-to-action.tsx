"use client";

import Link from "next/link";

import { Button } from "@acme/ui/button";

export default function CallToAction() {
  return (
    <section className="bg-gradient-to-br from-muted/20 via-accent/20 to-background/25 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Start building your <span className="text-accent">dream car</span>{" "}
            today
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Join 10,000+ car enthusiasts across India who trust us for quality
            used parts.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-6 sm:flex-row">
          <Button size="lg">
            <Link href="/listings">Browse Parts</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/listings/new">List Your Parts</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
