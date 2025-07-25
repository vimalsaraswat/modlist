import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host");

  if (
    hostname === "modlist.shop" &&
    new URL(request.url).pathname !== "/waitlist"
  ) {
    return NextResponse.redirect(new URL("/waitlist", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * Match all request paths except for:
     * - /api routes
     * - /_next/static (static files)
     * - /_next/image (image optimization)
     * - /favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
