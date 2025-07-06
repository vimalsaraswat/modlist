"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center space-x-8 md:flex">
      <Link
        href="/listings"
        className={`transition-colors ${
          pathname === "/listings"
            ? "text-orange-400"
            : "text-zinc-300 hover:text-orange-400"
        }`}
      >
        Browse Parts
      </Link>
      <Link
        href="/listings/new"
        className={`transition-colors ${
          pathname === "/listings/new"
            ? "text-orange-400"
            : "text-zinc-300 hover:text-orange-400"
        }`}
      >
        Sell Parts
      </Link>
    </nav>
  );
};

export default Navbar;
