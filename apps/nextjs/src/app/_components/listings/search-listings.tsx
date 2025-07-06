"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";

// import { FunnelIcon } from "lucide-react";

// import { useDebouncedCallback } from "use-debounce";

// import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";

import { useTRPC } from "~/trpc/react";

const SearchListings = () => {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("query") ?? "",
  );
  const [category, setCategory] = useState(
    () => searchParams.get("category") ?? "all",
  );
  const [makeId, setMakeId] = useState(
    () => Number(searchParams.get("make")) || -1,
  );

  // Fetch categories and makes for dropdowns
  const { data: categories = [] } = useQuery(
    trpc.listing.categoryList.queryOptions(),
  );
  const { data: makes = [] } = useQuery(trpc.listing.makeList.queryOptions());

  // Update URL with active filters
  const updateFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (category && category !== "all") params.set("category", category);
    if (makeId && makeId !== -1) params.set("make", String(makeId));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const debouncedUpdate = updateFilters;

  useEffect(() => debouncedUpdate(), [searchQuery, category, makeId]);

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="tuner-glow border-zinc-700/50 bg-zinc-800/80 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-zinc-600 bg-zinc-700/50 pl-10 text-white placeholder-zinc-400 focus:border-orange-400"
              />
            </div>

            {/* Category Dropdown */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full border-zinc-600 bg-zinc-700/50 text-white md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="border-zinc-700 bg-zinc-800">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Make Dropdown */}
            <Select
              value={String(makeId)}
              onValueChange={(v) => setMakeId(Number(v))}
            >
              <SelectTrigger className="w-full border-zinc-600 bg-zinc-700/50 text-white md:w-48">
                <SelectValue placeholder="Make" />
              </SelectTrigger>
              <SelectContent className="border-zinc-700 bg-zinc-800">
                <SelectItem value="-1">All Makes</SelectItem>
                {makes.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/*
            <Button className="md:w-auto">
              <FunnelIcon className="mr-2" />
              Filter
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchListings;
