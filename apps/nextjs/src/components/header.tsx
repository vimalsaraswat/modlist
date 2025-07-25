import Link from "next/link";
import { Settings } from "lucide-react";

import { Badge } from "@acme/ui/badge";

import Navbar from "./navbar";
import { UserAccountNav } from "./user-account-nav";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo Section - Responsive sizing and spacing */}
        <div className="mr-4 flex">
          <div className="md:hidden">
            <Navbar />
          </div>
          <Link
            href="/"
            className="mr-4 flex items-center gap-2 transition-opacity hover:opacity-80 lg:gap-3"
          >
            <div className="relative">
              <div className="relative hidden h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/90 shadow-md md:flex lg:h-9 lg:w-9">
                <Settings className="h-4 w-4 text-primary-foreground lg:h-5 lg:w-5" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight lg:text-xl">
                ModList
              </span>
              <Badge
                variant="secondary"
                className="hidden px-1.5 py-0.5 text-xs font-medium sm:inline-flex"
              >
                Beta
              </Badge>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="hidden md:block">
            <Navbar />
          </div>
          <div className="md:hidden" />

          {/* Right side - User account navigation */}
          <div className="flex items-center space-x-2">
            <UserAccountNav />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
