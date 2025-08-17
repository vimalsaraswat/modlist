import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { trpc } from "~/utils/api";

interface FavouriteButtonProps {
  listingId: string;
  initialIsFavourited: boolean;
}

const FavouriteButton = ({
  listingId,
  initialIsFavourited,
}: FavouriteButtonProps) => {
  const queryClient = useQueryClient();

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
        Toast.show({
          type: "error",
          text1: "Failed to toggle favourite status",
        });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.listing.byId.queryFilter({ id: listingId }),
        );
        await queryClient.invalidateQueries({
          queryKey: trpc.listing.favouritesList.queryKey(),
          exact: false,
        });
      },
    }),
  );

  const handleToggleFavourite = () => {
    mutate({ id: listingId });
  };

  return (
    <TouchableOpacity
      onPress={handleToggleFavourite}
      disabled={isPending}
      className="p-2"
    >
      <Ionicons
        name={isFavourited ? "heart" : "heart-outline"}
        size={24}
        color={isFavourited ? "#ef4444" : "#94a3b8"}
        fill={isFavourited ? "#ef4444" : "none"}
      />
    </TouchableOpacity>
  );
};

export default FavouriteButton;
