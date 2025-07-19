"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";

import { Button } from "@acme/ui/button";
import { toast } from "@acme/ui/toast";

import { useTRPC } from "~/trpc/react";

interface FavouriteButtonProps {
  listingId: string;
  initialIsFavourited: boolean;
}

const FavouriteButton = ({
  listingId,
  initialIsFavourited,
}: FavouriteButtonProps) => {
  const trpc = useTRPC();

  const [isFavourited, setIsFavourited] = useState(initialIsFavourited);

  const { mutate, isPending } = useMutation(
    trpc.listing.toggleFavourite.mutationOptions({
      onMutate: () => {
        const previousIsFavourited = isFavourited;
        setIsFavourited((prev) => !prev);
        return { previousIsFavourited };
      },
      onError: (err, _, context) => {
        if (context?.previousIsFavourited !== undefined) {
          setIsFavourited(context.previousIsFavourited);
        }
        console.error("Failed to toggle favourite status:", err);
        toast.error("Failed to toggle favourite status");
      },
    }),
  );

  const handleToggleFavourite = () => {
    mutate({ id: listingId });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleFavourite}
      disabled={isPending}
    >
      <HeartIcon
        className={`h-4 w-4 ${
          isFavourited
            ? "fill-red-500 text-red-500 hover:fill-red-600 hover:text-red-600"
            : "fill-none hover:text-accent-foreground"
        } `}
      />
    </Button>
  );
};

export default FavouriteButton;
