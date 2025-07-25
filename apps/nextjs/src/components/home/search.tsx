import { MapPinIcon, SearchIcon } from "lucide-react";

import { Card, CardContent } from "@acme/ui/card";
import { Input } from "@acme/ui/input";

export const Search = () => (
  <div className="mx-auto max-w-2xl">
    <Card className="border-border/50 bg-card/50 backdrop-blur-lg">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center space-x-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search for parts, mods, accessories..."
              className="border-border bg-background/50 pl-10"
            />
          </div>
          <select className="rounded-md border border-border bg-background/50 px-3 py-2 text-foreground">
            <option>All Cars</option>
            <option>Honda Civic</option>
            <option>Subaru WRX</option>
            <option>BMW M3</option>
          </select>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPinIcon className="mr-1 h-4 w-4" />
          <span>San Francisco, CA • 847 parts nearby</span>
        </div>
      </CardContent>
    </Card>
  </div>
);
