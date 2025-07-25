import { Mail, Send } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

export default function WaitlistPage() {
  return (
    <div className="bg-modlist-background flex min-h-screen items-center justify-center p-4">
      <Card className="bg-modlist-card text-modlist-text w-full max-w-md border border-gray-700 shadow-lg">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <Mail className="text-modlist-primary h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Join ModList
          </CardTitle>
          <CardDescription className="text-modlist-text-muted">
            Be the first to know when we launch. No spam, ever.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-modlist-text-muted">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="focus:border-modlist-primary focus:ring-modlist-primary border-gray-600 bg-gray-800"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button className="from-modlist-primary to-modlist-secondary hover:from-modlist-primary-dark hover:to-modlist-secondary/90 w-full bg-gradient-to-r">
            <span>Join Waitlist</span>
            <Send className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-modlist-text-muted text-center text-xs">
            By joining, you agree to our{" "}
            <a href="/privacy" className="text-modlist-accent hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>

      <footer className="absolute bottom-4 w-full text-center">
        <p className="text-modlist-text-muted text-xs">
          © {new Date().getFullYear()} ModList. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
