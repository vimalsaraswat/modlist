"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@acme/ui/alert";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader } from "@acme/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <Card className="border-0 shadow-xl backdrop-blur-sm">
          <CardHeader className="pb-4 text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
              <p className="text-sm text-muted-foreground">
                We're sorry for the inconvenience. Please try again.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-base font-medium">
                Error Details
              </AlertTitle>
              <AlertDescription className="mt-2 text-sm leading-relaxed">
                {error.message ||
                  "An unexpected error occurred while processing your request."}
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => reset()}
                className="w-full transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                size="lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>

            {/* Additional Help Text */}
            <div className="rounded-lg p-4">
              <h3 className="mb-2 text-sm font-medium text-secondary-foreground">
                What you can do:
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Check your internet connection</li>
                <li>• Refresh the page or try again in a few moments</li>
                <li>• Contact support if the problem persists</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            If this error continues, please reach out to our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
