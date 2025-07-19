import { Suspense } from "react";

import { Badge } from "@acme/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Separator } from "@acme/ui/separator";

import AddListingForm from "~/app/_components/listings/add-listing-form";
import Loader from "~/app/_components/loader";
import { getSession } from "~/auth/server";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function ListingsPage() {
  const session = await getSession();

  if (session) {
    prefetch(trpc.listing.categoryList.queryOptions());
    prefetch(trpc.listing.makeList.queryOptions());
    prefetch(trpc.listing.cityList.queryOptions());
  }

  return (
    <HydrateClient>
      <main className="min-h-screen bg-zinc-900">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-orange-900/30 py-16">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-orange-500/10 to-red-500/10"></div>
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <div className="mb-6 flex justify-center">
              <Badge
                variant="secondary"
                className="border-orange-500/30 bg-orange-500/20 text-orange-400"
              >
                🚗 Auto Parts Marketplace
              </Badge>
            </div>
            <h1 className="neon-text mb-4 text-5xl font-bold text-white md:text-6xl">
              List Your <span className="text-orange-400">Parts</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-zinc-300">
              Turn your spare parts into cash. Reach thousands of enthusiasts
              looking for exactly what you're selling.
            </p>

            {/* Feature highlights */}
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="border-zinc-700 bg-zinc-800/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="mb-2 text-2xl">⚡</div>
                  <h3 className="font-semibold text-white">Quick Listing</h3>
                  <p className="text-sm text-zinc-400">
                    Get your parts online in minutes
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zinc-700 bg-zinc-800/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="mb-2 text-2xl">🎯</div>
                  <h3 className="font-semibold text-white">Targeted Reach</h3>
                  <p className="text-sm text-zinc-400">
                    Connect with genuine buyers
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zinc-700 bg-zinc-800/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="mb-2 text-2xl">💰</div>
                  <h3 className="font-semibold text-white">Best Prices</h3>
                  <p className="text-sm text-zinc-400">
                    Maximize your part's value
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
          {session ? (
            <div className="space-y-6">
              {/* Instructions Card */}
              <Card className="border-zinc-700 bg-zinc-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    📋 How to List Your Parts
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Follow these simple steps to create an effective listing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Badge
                          variant="outline"
                          className="border-orange-500/30 bg-orange-500/20 text-orange-400"
                        >
                          1
                        </Badge>
                        <div>
                          <h4 className="font-medium text-white">
                            Add Details
                          </h4>
                          <p className="text-sm text-zinc-400">
                            Provide part name, condition, and specifications
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge
                          variant="outline"
                          className="border-orange-500/30 bg-orange-500/20 text-orange-400"
                        >
                          2
                        </Badge>
                        <div>
                          <h4 className="font-medium text-white">
                            Upload Photos
                          </h4>
                          <p className="text-sm text-zinc-400">
                            Clear images help buyers make decisions
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Badge
                          variant="outline"
                          className="border-orange-500/30 bg-orange-500/20 text-orange-400"
                        >
                          3
                        </Badge>
                        <div>
                          <h4 className="font-medium text-white">Set Price</h4>
                          <p className="text-sm text-zinc-400">
                            Research market value for competitive pricing
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge
                          variant="outline"
                          className="border-orange-500/30 bg-orange-500/20 text-orange-400"
                        >
                          4
                        </Badge>
                        <div>
                          <h4 className="font-medium text-white">Publish</h4>
                          <p className="text-sm text-zinc-400">
                            Go live and start receiving inquiries
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator className="bg-zinc-700" />

              {/* Listing Form */}
              <Card className="border-zinc-700 bg-zinc-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    ✨ Create New Listing
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Fill out the form below to list your automotive part
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<Loader />}>
                    <AddListingForm />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-zinc-700 bg-zinc-800/50">
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    Sign In Required
                  </h3>
                  <p className="mb-6 text-zinc-400">
                    Only logged in users can list their parts. Please sign in to
                    continue and start selling your automotive parts.
                  </p>
                  {/* <div className="flex justify-center gap-4">
                    <Button className="bg-orange-500 text-white hover:bg-orange-600">
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                    >
                      Learn More
                    </Button>
                    </div> */}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
