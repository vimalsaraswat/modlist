"use client";

import React, { useEffect, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { cn } from ".";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export { ThemeProvider } from "next-themes";

const themes = [
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "System", value: "system" },
  // { name: "Midnight 🌃", value: "midnight" },
  // { name: "Track Day 🏁", value: "track-day" },
  // { name: "Classic 🎩", value: "classic" },
  // { name: "Garage 🛠️", value: "garage" },
  // { name: "Rosso Corsa 🏎️", value: "rosso-corsa" },
  // { name: "Chrome ✨", value: "chrome" },
  // // New ModList-inspired themes
  // { name: "Engine Bay ⚙️", value: "engine-bay" },
  // { name: "Asphalt 🛣️", value: "asphalt" },
  // { name: "White Wall ⚪", value: "white-wall" },
];

const themeValues = themes
  .map((t) => t.value)
  .filter((v) => v !== "system" && v !== "light" && v !== "dark");

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="outline" size="icon" disabled className="shadow-md" />
    );
  }

  /**
   * Manually removes all custom theme classes from the <html> tag.
   * This is the core fix for theme stacking issues when using custom classes.
   */
  const cleanupThemeClasses = () => {
    if (typeof window !== "undefined") {
      const htmlElement = document.documentElement;
      themeValues.forEach((t) => {
        htmlElement.classList.remove(t);
      });
      // Also ensure standard themes don't stack if they are being used as custom themes
      htmlElement.classList.remove("light", "dark");
    }
  };

  const handleThemeChange = (newTheme: string) => {
    // 1. Manually clean up any existing custom theme classes first
    cleanupThemeClasses();

    // 2. Let next-themes apply the new theme class
    setTheme(newTheme);
  };

  // Determine the icon based on the resolved theme state
  const isDark =
    resolvedTheme === "dark" ||
    (resolvedTheme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const PrimaryIcon = isDark ? MoonIcon : SunIcon;

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="gap-2 shadow-md sm:w-14"
        >
          {/* Display current theme icon */}
          <PrimaryIcon className="size-5" />

          {/* Chevron icon to indicate dropdown status */}
          <ChevronDownIcon
            className={cn(
              "size-4 transition-transform max-sm:hidden",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />

          <span className="sr-only">Toggle theme (Current: {theme})</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {themes.map((t, index) => (
          <React.Fragment key={t.value}>
            {/* Separator before custom themes (index 3 is 'Midnight') */}
            {index === 3 && <hr className="my-1 border-border" />}

            <DropdownMenuItem
              onClick={() => handleThemeChange(t.value)}
              className={cn(
                "justify-between",
                t.value === theme && "bg-secondary text-secondary-foreground",
              )}
            >
              {t.name}
              {t.value === theme && <CheckIcon className="ml-2 size-4" />}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
