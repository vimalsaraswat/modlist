"use client";

import { Dialog, DialogContent, DialogTitle } from "@acme/ui/dialog";

import { CreatePostForm } from "./create-post-form";

export function CreatePostDialog({
  category,
  open,
  onOpenChange,
}: {
  category: { id: string; slug: string; name: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle />
      <DialogContent>
        <CreatePostForm
          category={category}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
