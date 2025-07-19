"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, X } from "lucide-react";

import { useDebouncedCallback } from "@acme/ui/hooks";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // LOCAL STATE for input, so typing is instant
  const [inputValue, setInputValue] = useState<string>(
    searchParams.get("query") ?? "",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // When the route's query string changes outside (back/forward, SSR), update local state.
  useEffect(() => {
    setInputValue(searchParams.get("query") ?? "");
  }, [searchParams]); // listen for query param changes

  // Debounced change to URL/query string (not input itself)
  const updateQueryInUrl = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  // onChange: update local input value immediately, debounce URL update
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      updateQueryInUrl(val);
    },
    [updateQueryInUrl],
  );

  const onClear = useCallback(() => {
    setInputValue("");
    updateQueryInUrl("");
  }, [updateQueryInUrl]);

  // Handle escape key to clear
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && inputValue) {
        onClear();
        e.stopPropagation();
      }
    },
    [onClear, inputValue],
  );

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <Label htmlFor="search-input" className="sr-only">
        Search
      </Label>
      <Input
        id="search-input"
        inputMode="search"
        ref={inputRef}
        className="peer px-10"
        placeholder="Search parts, descriptions..."
        value={inputValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoComplete="off"
        aria-label="Search"
        spellCheck={false}
      />
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-primary/60 peer-focus:text-primary"
        aria-hidden="true"
      />
      {inputValue.trim() && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={onClear}
          aria-label="Clear search"
          tabIndex={0}
        >
          <X
            className="h-[18px] w-[18px] text-primary/60 peer-focus:text-primary"
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}
