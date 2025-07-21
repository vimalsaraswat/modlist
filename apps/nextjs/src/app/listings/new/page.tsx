import { Suspense } from "react";

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
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
          {session ? (
            <Suspense fallback={<Loader />}>
              <AddListingForm />
            </Suspense>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
              <div className="max-w-md space-y-4">
                <h3 className="text-xl font-semibold">Sign In Required</h3>
                <p className="text-muted-foreground">
                  Only logged in users can list their parts. Please sign in to
                  continue.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
