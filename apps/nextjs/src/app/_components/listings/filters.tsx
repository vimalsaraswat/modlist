"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CarIcon, FilterIcon, MapIcon, TagIcon, X } from "lucide-react";

import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { Label } from "@acme/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@acme/ui/sheet";

import { useTRPC } from "~/trpc/react";
import Combobox from "../common/combobox";

const defaultFilters = {
  category: "all",
  makeId: -1,
  city: -1,
};

const Filters = () => {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Grouped state
  const [filters, setFilters] = useState({
    category: searchParams.get("category") ?? "all",
    makeId: Number(searchParams.get("make")) || -1,
    city: Number(searchParams.get("city")) || -1,
  });

  const [isOpen, setIsOpen] = useState(false);

  // Fetch static options
  const { data: categories = [] } = useQuery(
    trpc.listing.categoryList.queryOptions(),
  );
  const { data: makes = [] } = useQuery(trpc.listing.makeList.queryOptions());
  const { data: cities = [] } = useQuery(trpc.listing.cityList.queryOptions());

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.makeId !== -1) params.set("make", String(filters.makeId));
    if (filters.city !== -1) params.set("city", String(filters.city));

    const queryStr = params.toString();
    router.replace(queryStr ? `${pathname}?${queryStr}` : pathname, {
      scroll: false,
    });
  }, [filters, pathname, router]);

  useEffect(updateFilters, [filters, updateFilters]);

  const clearFilters = () => {
    setFilters(defaultFilters);
    router.replace(pathname);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.category !== "all" || filters.makeId !== -1 || filters.city !== -1
    );
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    return [
      filters.category !== "all" ? filters.category : null,
      filters.makeId !== -1 ? filters.makeId : null,
      filters.city !== -1 ? filters.city : null,
    ].filter(Boolean).length;
  }, [filters]);

  const getNameById = useCallback(
    (
      id: number | string,
      list: { id: number; name: string }[],
      key: "id" = "id",
    ) => {
      const found = list.find((item) => String(item[key]) === String(id));
      return found?.name ?? null;
    },
    [],
  );

  const badges = [
    getNameById(filters.category, categories) && {
      label: getNameById(filters.category, categories),
      onClear: () => setFilters((f) => ({ ...f, category: "all" })),
      color: "blue",
    },
    getNameById(filters.makeId, makes) && {
      label: getNameById(filters.makeId, makes),
      onClear: () => setFilters((f) => ({ ...f, makeId: -1 })),
      color: "green",
    },
    getNameById(filters.city, cities) && {
      label: getNameById(filters.city, cities),
      onClear: () => setFilters((f) => ({ ...f, city: -1 })),
      color: "green",
    },
  ].filter(Boolean);

  const filterFields = [
    {
      icon: <TagIcon className="h-4 w-4 text-zinc-400" />,
      label: "Category",
      value: filters.category,
      onChange: (v: string) => setFilters((f) => ({ ...f, category: v })),
      options: [
        { label: "All Categories", value: "all" },
        ...categories.map((c) => ({ label: c.name, value: String(c.id) })),
      ],
    },
    {
      icon: <CarIcon className="h-4 w-4 text-zinc-400" />,
      label: "Make",
      value: String(filters.makeId),
      onChange: (v: string) => setFilters((f) => ({ ...f, makeId: Number(v) })),
      options: [
        { label: "All Makes", value: "-1" },
        ...makes.map((m) => ({ label: m.name, value: String(m.id) })),
      ],
    },
    {
      icon: <MapIcon className="h-4 w-4 text-zinc-400" />,
      label: "City",
      value: String(filters.city),
      onChange: (v: string) => setFilters((f) => ({ ...f, city: Number(v) })),
      options: [
        { label: "All Cities", value: "-1" },
        ...cities.map((c) => ({ label: c.name, value: String(c.id) })),
      ],
    },
  ];

  const ActiveFilters = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <div />
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-6 px-2 text-xs"
        >
          Clear All
        </Button>
      </div>
      <div className="flex max-w-80 flex-wrap gap-2">
        {badges.map((badge, i) => {
          if (!badge) return;
          return (
            <Badge
              key={i}
              variant="secondary"
              className={`border-${badge.color}-500/20 bg-${badge.color}-500/10 text-${badge.color}-300`}
            >
              {badge.label}
              <button onClick={badge.onClear} className="ml-1 hover:text-white">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>
    </div>
  );

  const FilterSection = () => (
    <div className="space-y-6">
      {hasActiveFilters && <ActiveFilters />}

      {filterFields.map((field, i) => (
        <div className="flex flex-col gap-2" key={i}>
          <div className="flex items-center gap-2">
            {field.icon}
            <Label>{field.label}</Label>
          </div>
          <Combobox
            value={field.value}
            onChange={field.onChange}
            options={field.options}
            placeholder={`Select ${field.label.toLowerCase()}`}
          />
          {/* <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={`Select ${field.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-full lg:block">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FilterIcon className="h-5 w-5" />
              Filter Parts
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FilterSection />
          </CardContent>
        </Card>
      </aside>

      {/* Mobile */}
      <div className="flex w-full flex-wrap items-center gap-3">
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <FilterIcon className="mr-1 h-4 w-4" />
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="max-h-dvh w-full space-y-2 overflow-auto pt-2 backdrop-blur-md"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FilterIcon className="h-5 w-5 text-primary-foreground" />
                  Filter Parts
                </SheetTitle>
              </SheetHeader>
              <div className="py-10">
                <FilterSection />
              </div>

              <SheetFooter className="bottom-0">
                <Button onClick={() => setIsOpen(false)} variant="secondary">
                  View Results
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default Filters;
