import { Card, CardContent } from "@acme/ui/card";
import { Separator } from "@acme/ui/separator";
import { Skeleton } from "@acme/ui/skeleton";

export default function ChatPageLoading() {
  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-3xl flex-col gap-4 px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Separator />

      {/* Messages container */}
      <Card className="flex w-full flex-1 flex-col overflow-hidden">
        <CardContent className="no-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {/* Skeleton messages */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`max-w-[70%] rounded-lg bg-muted p-3 text-sm ${
                i % 2 === 0 ? "ml-auto" : "mr-auto"
              }`}
            >
              <Skeleton className="h-4 w-40" />
              <div className="mt-2 flex justify-end">
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Message input */}
      <div className="flex gap-0">
        <Skeleton className="h-10 flex-1 rounded-r-none" />
        <Skeleton className="h-10 w-12 rounded-l-none" />
      </div>
    </div>
  );
}
