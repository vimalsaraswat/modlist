"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CarIcon,
  CogIcon,
  FilterIcon,
  // IndianRupeeIcon,
  MapIcon,
  TagIcon,
  X,
} from "lucide-react";

import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
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

interface Badge {
  label: string;
  onClear: () => void;
  color: string;
}

const defaultFilters = {
  category: "all",
  makeId: -1,
  modelId: -1,
  modificationId: -1,
  city: -1,
  minPrice: "",
  maxPrice: "",
};

const Filters = () => {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [filters, setFilters] = useState({
    category: searchParams.get("category") ?? "all",
    makeId: Number(searchParams.get("make")) || -1,
    modelId: Number(searchParams.get("model")) || -1,
    modificationId: Number(searchParams.get("modification")) || -1,
    city: Number(searchParams.get("city")) || -1,
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
  });

  const currentFilters = useMemo(
    () => ({
      category: searchParams.get("category") ?? "all",
      makeId: Number(searchParams.get("make")) || -1,
      modelId: Number(searchParams.get("model")) || -1,
      modificationId: Number(searchParams.get("modification")) || -1,
      city: Number(searchParams.get("city")) || -1,
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
    }),
    [searchParams],
  );

  const [isOpen, setIsOpen] = useState(false);

  // Fetch static options
  const { data: categories = [] } = useQuery(
    trpc.listing.categoryList.queryOptions(),
  );
  const { data: makes = [] } = useQuery(trpc.listing.makeList.queryOptions());
  const { data: cities = [] } = useQuery(trpc.listing.cityList.queryOptions());
  const { data: models = [] } = useQuery(
    trpc.listing.modelListByMake.queryOptions(
      { makeId: Number(filters.makeId) },
      { enabled: !!filters.makeId && filters.makeId !== -1 },
    ),
  );
  const { data: modifications = [] } = useQuery(
    trpc.listing.modificationsListByModel.queryOptions(
      { modelId: Number(filters.modelId) },
      { enabled: !!filters.modelId && filters.modelId !== -1 },
    ),
  );

  const filtersChanged = useMemo(() => {
    return (
      filters.category !== currentFilters.category ||
      filters.makeId !== currentFilters.makeId ||
      filters.modelId !== currentFilters.modelId ||
      filters.modificationId !== currentFilters.modificationId ||
      filters.city !== currentFilters.city ||
      filters.minPrice !== currentFilters.minPrice ||
      filters.maxPrice !== currentFilters.maxPrice
    );
  }, [filters, currentFilters]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    const rules: {
      key: keyof typeof filters;
      param: string;
    }[] = [
      { key: "category", param: "category" },
      { key: "makeId", param: "make" },
      { key: "modelId", param: "model" },
      { key: "modificationId", param: "modification" },
      { key: "city", param: "city" },
      { key: "minPrice", param: "minPrice" },
      { key: "maxPrice", param: "maxPrice" },
    ];

    rules.forEach(({ key, param }) => {
      const val = filters[key];
      const def = defaultFilters[key];
      if (val !== def && val !== "" && val !== -1) {
        params.set(param, String(val));
      } else {
        params.delete(param);
      }
    });

    // special rule: if makeId is reset, clear model as well
    if (filters.makeId === -1) {
      params.delete("model");
      params.delete("modification");
    }

    if (filters.modelId === -1) {
      params.delete("modification");
    }

    const queryStr = params.toString();
    router.replace(queryStr ? `${pathname}?${queryStr}` : pathname, {
      scroll: false,
    });

    setIsOpen(false);
  }, [filters, pathname, router, searchParams]);

  const clearFilters = () => {
    setFilters(defaultFilters);
    router.replace(pathname, { scroll: false });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.category !== "all" ||
      filters.makeId !== -1 ||
      filters.modelId !== -1 ||
      filters.modificationId !== -1 ||
      filters.city !== -1 ||
      filters.minPrice !== "" ||
      filters.maxPrice !== ""
    );
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    return [
      filters.category !== "all" ? filters.category : null,
      filters.makeId !== -1 ? filters.makeId : null,
      filters.modelId !== -1 ? filters.modelId : null,
      filters.modificationId !== -1 ? filters.modificationId : null,
      filters.city !== -1 ? filters.city : null,
      filters.minPrice ? filters.minPrice : null,
      filters.maxPrice ? filters.maxPrice : null,
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

  const categoryName = getNameById(filters.category, categories);
  const makeName = getNameById(filters.makeId, makes);
  const modelName = getNameById(filters.modelId, models);
  const modificationName = getNameById(filters.modificationId, modifications);
  const cityName = getNameById(filters.city, cities);

  const clearFilter = useCallback(
    (key: keyof typeof filters, defaultValue: string | number = "") => {
      const params = new URLSearchParams(searchParams.toString());

      switch (key) {
        case "category":
          params.delete("category");
          break;
        case "makeId":
          params.delete("make");
          params.delete("model");
          break;
        case "modelId":
          params.delete("model");
          break;
        case "modificationId":
          params.delete("modification");
          break;
        case "city":
          params.delete("city");
          break;
        case "minPrice":
          params.delete("minPrice");
          break;
        case "maxPrice":
          params.delete("maxPrice");
          break;
      }

      const queryStr = params.toString();
      router.replace(queryStr ? `${pathname}?${queryStr}` : pathname, {
        scroll: false,
      });

      setFilters((f) => ({ ...f, [key]: defaultValue }));
    },
    [pathname, router, searchParams],
  );

  const badges: Badge[] = [
    !!categoryName && {
      label: categoryName,
      onClear: () => clearFilter("category", "all"),
      color: "blue",
    },
    !!makeName && {
      label: makeName,
      onClear: () => {
        clearFilter("makeId", -1);
        clearFilter("modelId", -1);
      },
      color: "green",
    },
    !!modelName && {
      label: modelName,
      onClear: () => clearFilter("modelId", -1),
      color: "green",
    },
    !!modificationName && {
      label: modificationName,
      onClear: () => clearFilter("modificationId", -1),
      color: "green",
    },
    !!cityName && {
      label: cityName,
      onClear: () => clearFilter("city", -1),
      color: "green",
    },
    !!filters.minPrice && {
      label: `Min: ${filters.minPrice}`,
      onClear: () => clearFilter("minPrice", ""),
      color: "yellow",
    },
    !!filters.maxPrice && {
      label: `Max: ${filters.maxPrice}`,
      onClear: () => clearFilter("maxPrice", ""),
      color: "yellow",
    },
  ].filter((badge): badge is Badge => Boolean(badge));

  const filterFields = [
    {
      icon: <TagIcon className="h-4 w-4 text-zinc-400" />,
      label: "Category",
      type: "combobox" as const,
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
      type: "combobox" as const,
      value: String(filters.makeId),
      onChange: (v: string) =>
        setFilters((f) => ({
          ...f,
          makeId: Number(v),
          ...(filters.makeId === Number(v)
            ? {}
            : { modelId: -1, modificationId: -1 }),
        })),
      options: [
        { label: "All Makes", value: "-1" },
        ...makes.map((m) => ({ label: m.name, value: String(m.id) })),
      ],
    },
    {
      icon: <CarIcon className="h-4 w-4 text-zinc-400" />,
      label: "Model",
      type: "combobox" as const,
      value: String(filters.modelId),
      onChange: (v: string) =>
        setFilters((f) => ({
          ...f,
          modelId: Number(v),
          ...(filters.modelId === Number(v) ? {} : { modificationId: -1 }),
        })),
      options: [
        { label: "All Models", value: "-1" },
        ...models.map((m) => ({ label: m.name, value: String(m.id) })),
      ],
    },
    {
      icon: <CogIcon className="h-4 w-4 text-zinc-400" />,
      label: "Modification",
      type: "combobox" as const,
      value: String(filters.modificationId),
      onChange: (v: string) =>
        setFilters((f) => ({ ...f, modificationId: Number(v) })),
      options: [
        { label: "All Modifications", value: "-1" },
        ...modifications.map((m) => ({ label: m.name, value: String(m.id) })),
      ],
    },
    {
      icon: <MapIcon className="h-4 w-4 text-zinc-400" />,
      label: "City",
      type: "combobox" as const,
      value: String(filters.city),
      onChange: (v: string) => setFilters((f) => ({ ...f, city: Number(v) })),
      options: [
        { label: "All Cities", value: "-1" },
        ...cities.map((c) => ({
          label: `${c.name} (${c.state})`,
          value: String(c.id),
        })),
      ],
    },
    // {
    //   icon: <IndianRupeeIcon className="h-4 w-4 text-zinc-400" />,
    //   label: "Min Price",
    //   type: "input" as const,
    //   value: filters.minPrice,
    //   onChange: (v: string) => setFilters((f) => ({ ...f, minPrice: v })),
    // },
    // {
    //   icon: <IndianRupeeIcon className="h-4 w-4 text-zinc-400" />,
    //   label: "Max Price",
    //   type: "input" as const,
    //   value: filters.maxPrice,
    //   onChange: (v: string) => setFilters((f) => ({ ...f, maxPrice: v })),
    // },
  ];

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
            <FilterSection
              hasActiveFilters={hasActiveFilters}
              badges={badges}
              clearFilters={clearFilters}
              filterFields={filterFields}
            />
            <div className="mt-6">
              <Button
                className="w-full"
                disabled={!filtersChanged}
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>
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
              className="flex max-h-dvh w-full flex-col gap-2 overflow-auto backdrop-blur-md"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FilterIcon className="h-5 w-5 text-primary-foreground" />
                  Filter Parts
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-auto py-2">
                <FilterSection
                  hasActiveFilters={hasActiveFilters}
                  badges={badges}
                  clearFilters={clearFilters}
                  filterFields={filterFields}
                />
              </div>
              <SheetFooter className="bottom-0 flex-row items-center gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  disabled={!filtersChanged}
                  className="flex-1"
                  onClick={applyFilters}
                >
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

const ActiveFilters = ({
  clearFilters,
  badges,
}: {
  clearFilters: () => void;
  badges: {
    label: string;
    onClear: () => void;
    color: string;
  }[];
}) => (
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
      {badges.map((badge, i) => (
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
      ))}
    </div>
  </div>
);

const FilterSection = ({
  hasActiveFilters,
  badges,
  clearFilters,
  filterFields,
}: {
  hasActiveFilters: boolean;
  badges: { label: string; onClear: () => void; color: string }[];
  clearFilters: () => void;
  filterFields: {
    icon: React.ReactNode;
    label: string;
    type: "combobox" | "input";
    value: string;
    onChange: (v: string) => void;
    options?: { label: string; value: string }[];
  }[];
}) => (
  <section className="space-y-6">
    {hasActiveFilters && (
      <ActiveFilters clearFilters={clearFilters} badges={badges} />
    )}
    {filterFields.map((field, i) => (
      <div className="flex flex-col gap-2" key={i}>
        <div className="flex items-center gap-2">
          {field.icon}
          <Label>{field.label}</Label>
        </div>
        {field.type === "combobox" ? (
          <Combobox
            value={field.value}
            onChange={field.onChange}
            options={field.options ?? []}
            placeholder={`Select ${field.label.toLowerCase()}`}
          />
        ) : (
          <Input
            type="number"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )}
      </div>
    ))}
  </section>
);

export default Filters;
