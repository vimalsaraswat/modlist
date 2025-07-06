import React from "react";
import Link from "next/link";
import { Settings } from "lucide-react";

// import { Button } from "@acme/ui/button";
// import { Input } from "@acme/ui/input";

import Navbar from "./navbar";
import { UserAccountNav } from "./user-account-nav";

const Header = () => {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-800 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
              <Settings size={20} />
            </div>
            <span className="text-xl font-bold">ModList</span>
          </Link>

          {/* Navigation */}
          <Navbar />

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            <UserAccountNav />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
