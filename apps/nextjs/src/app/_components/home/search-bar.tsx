import { Search } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

const SearchBar = () => {
  return (
    <div className="mx-auto mb-10 max-w-3xl rounded-full border border-input bg-background/80 shadow-lg backdrop-blur-sm">
      <form action="/listings" method="GET">
        <div className="flex items-center">
          <label htmlFor="search" className="sr-only">
            Search car parts
          </label>
          <Search className="ml-6 h-8 w-8 text-muted-foreground" />
          <Input
            autoFocus
            name="query"
            type="text"
            placeholder="Search for parts, part-number, brands..."
            className="border-none bg-transparent px-4 py-6 text-lg shadow-none focus-visible:ring-0"
            aria-label="Search car parts"
          />
          <Button
            type="submit"
            size="lg"
            className="mr-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
