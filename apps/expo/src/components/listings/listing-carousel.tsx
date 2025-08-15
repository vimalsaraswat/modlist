import React from "react";
import { Text, View } from "react-native";

import ImageCarousel from "../image-carausal";

interface ListingCarouselProps {
  images: string[];
}

const ListingCarousel = ({ images }: ListingCarouselProps) => {
  if (!images.length) {
    return (
      <View className="h-64 w-full items-center justify-center bg-muted">
        <Text className="text-muted-foreground">No images available</Text>
      </View>
    );
  }

  return (
    <View className="h-64 w-full py-2">
      <ImageCarousel images={images} height={250} />
    </View>
  );
};

export default ListingCarousel;
