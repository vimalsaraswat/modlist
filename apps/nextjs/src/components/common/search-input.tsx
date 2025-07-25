"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { cn } from "@acme/ui";
import { useDebouncedCallback } from "@acme/ui/hooks";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

export default function Search({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={cn("relative flex flex-1 flex-shrink-0", className)}>
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <Input
        className="peer pl-10"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-primary/60 peer-focus:text-primary" />
    </div>
  );
}
