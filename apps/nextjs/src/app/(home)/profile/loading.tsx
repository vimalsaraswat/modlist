import { Card, CardContent } from "@acme/ui/card";
import { Skeleton } from "@acme/ui/skeleton";

export default function ProfilePageLoading() {
  return (
    <main className="h-[calc(100dvh-4rem)] bg-background">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12">
        {/* Profile Header Skeleton */}
        <Card className="border-border bg-card/60 p-6 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <Skeleton className="h-20 w-20 rounded-full ring-4 ring-primary/20" />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex flex-col items-center gap-2 sm:items-end">
              <div className="flex gap-3">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        </Card>

        {/* Tabs + Grid Skeleton */}
        <div className="space-y-6">
          {/* Tabs buttons */}
          <div className="flex items-center gap-3 max-sm:flex-col">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-full sm:w-[400px]" />
          </div>

          {/* Grid of Listing Skeletons */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden border-border bg-card/30"
              >
                <Skeleton className="h-48 w-full" />
                <CardContent className="space-y-2 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-8 w-full rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
