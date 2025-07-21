import Link from "next/link";

import { Button } from "@acme/ui/button";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-muted/20 via-accent/20 to-background/25"></div>

      {/* Content */}
      <div className="relative z-20 px-6 text-center">
        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
          The{" "}
          <span className="neon-text inline-block text-accent">Tuner's</span>{" "}
          Marketplace
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-secondary-foreground md:text-xl">
          Buy and sell car parts, mods, and accessories.
          <br /> Connect with fellow enthusiasts.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="px-8 py-6 text-lg transition-transform hover:scale-[1.02]"
          >
            <Link href="/listings">Browse Parts</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-6 text-lg transition-transform hover:scale-[1.02]"
          >
            <Link href="/listings/new">List Your Parts</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-input">
          <div className="mt-2 h-3 w-1 rounded-full bg-accent"></div>
        </div>
      </div>
    </section>
  );
}
