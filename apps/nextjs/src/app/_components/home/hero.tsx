import Link from "next/link";
import { MapPin, Search, Star, TrendingUp } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Background with garage/automotive theme */}
      <div className="garage-pattern absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-orange-900/30">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-orange-500/10 to-red-500/10"></div>
      </div>

      {/* Floating Stats */}
      <Card className="animate-fade-in tuner-glow absolute right-8 top-32 border-zinc-700/50 bg-zinc-800/80 backdrop-blur-xl">
        <CardContent className="p-4 text-center">
          <div className="mb-2 flex items-center justify-center">
            <TrendingUp className="mr-2 text-orange-400" size={20} />
            <span className="font-semibold text-white">Active</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">15K+</div>
          <div className="text-sm text-zinc-400">Parts Listed</div>
        </CardContent>
      </Card>

      <Card
        className="animate-fade-in tuner-glow absolute left-8 top-48 border-zinc-700/50 bg-zinc-800/80 backdrop-blur-xl"
        style={{ animationDelay: "0.2s" }}
      >
        <CardContent className="p-4 text-center">
          <div className="mb-2 flex items-center justify-center">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={14}
                className="fill-current text-orange-400"
              />
            ))}
          </div>
          <div className="text-lg font-semibold text-white">4.9</div>
          <div className="text-sm text-zinc-400">User Rating</div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <h1 className="animate-slide-up mb-8 text-6xl font-bold leading-tight text-white md:text-8xl">
          The <span className="neon-text text-orange-400">tuner's</span>{" "}
          marketplace
        </h1>

        <p
          className="animate-slide-up mx-auto mb-12 max-w-3xl text-xl font-light leading-relaxed text-zinc-300 md:text-2xl"
          style={{ animationDelay: "0.2s" }}
        >
          Buy and sell used car parts, mods, and accessories. Connect with
          fellow enthusiasts in your city.
        </p>

        {/* Search Bar */}
        <div
          className="animate-slide-up mx-auto mb-8 max-w-2xl"
          style={{ animationDelay: "0.4s" }}
        >
          <Card className="tuner-glow border-zinc-700/50 bg-zinc-800/80 backdrop-blur-xl">
            <CardContent className="p-2">
              <div className="flex items-center">
                <div className="flex flex-1 items-center px-4">
                  <Search className="mr-3 text-zinc-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Search for wheels, exhaust, turbo kits..."
                    className="flex-1 border-none bg-transparent py-3 text-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="flex items-center border-l border-zinc-700 px-4">
                  <MapPin className="mr-2 text-zinc-400" size={18} />
                  <Select>
                    <SelectTrigger className="border-none bg-transparent text-zinc-300 focus:ring-0">
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-700 bg-zinc-800">
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="toronto">Toronto</SelectItem>
                      <SelectItem value="vancouver">Vancouver</SelectItem>
                      <SelectItem value="montreal">Montreal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="mx-2">Search</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div
          className="animate-slide-up flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.6s" }}
        >
          <Link href="/listings">
            <Button size="lg" className="px-8">
              Start Browsing
            </Button>
          </Link>
          <Link href="/listings/new">
            <Button
              variant="outline"
              size="lg"
              className="border-zinc-600 px-8 text-white hover:bg-zinc-800"
            >
              List Your Parts
            </Button>
          </Link>
        </div>

        <div
          className="animate-fade-in mt-16 text-sm text-zinc-400"
          style={{ animationDelay: "0.8s" }}
        >
          Join 25,000+ car enthusiasts buying and selling parts
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-zinc-600">
          <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-orange-400"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
