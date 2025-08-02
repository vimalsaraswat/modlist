"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Command, CommandGroup, CommandItem } from "@acme/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";

import { CreatePostDialog } from "./post/create-post-dialog";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface StartDiscussionProps {
  categories: Category[];
  category?: Category;
}

export function StartDiscussion({
  categories,
  category,
}: StartDiscussionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    slug: string;
    name: string;
  } | null>(category ?? null);

  const handleButtonClick = () => {
    if (category) {
      setSelectedCategory(category);
      setDialogOpen(true);
    }
  };

  const handleSelect = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return;
    setSelectedCategory(cat);
    setDialogOpen(true);
  };

  return (
    <>
      {category ? (
        <Button size="lg" onClick={handleButtonClick}>
          <Pencil className="mr-2 h-4 w-4" />
          Start a Discussion
        </Button>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="lg">
              <Pencil className="mr-2 h-4 w-4" />
              Start a Discussion
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0" align="center">
            <Command>
              <CommandGroup heading="Choose Category">
                {categories.map((cat) => (
                  <CommandItem
                    key={cat.slug}
                    value={cat.slug}
                    onSelect={handleSelect}
                  >
                    {cat.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {selectedCategory && (
        <CreatePostDialog
          category={selectedCategory}
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              if (!category) setSelectedCategory(null);
            }
          }}
        />
      )}
    </>
  );
}
