"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, Menu, Plus } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@acme/ui/sheet";

const navItems = [
  {
    label: "Browse Parts",
    href: "/listings",
    Icon: List,
  },
  {
    label: "Sell Parts",
    href: "/listings/new",
    Icon: Plus,
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-1 md:flex">
        {navItems.map(({ label, href, Icon }) => {
          const isActive = pathname === href;
          return (
            <Button
              key={href}
              variant={isActive ? "secondary" : "ghost"}
              asChild
              size="sm"
              className="text-sm font-medium"
            >
              <Link href={href}>
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="px-1 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetTitle />
          <div className="mt-6 flex flex-col gap-3">
            {navItems.map(({ label, href, Icon }) => {
              const isActive = pathname === href;
              return (
                <Button
                  key={href}
                  variant={isActive ? "secondary" : "ghost"}
                  asChild
                  className="h-12 justify-start text-base font-medium"
                >
                  <Link href={href} onClick={() => setIsOpen(false)}>
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
export default Navbar;
