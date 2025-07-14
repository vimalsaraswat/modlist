"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@acme/ui/carousel";

const ImageCarousel = ({ images }: { images: string[] }) => (
  <Carousel className="mx-4 sm:mx-auto sm:w-4/5">
    <CarouselContent>
      {images.map((image, index) => (
        <CarouselItem key={index}>
          <img
            src={image}
            alt="Product Preview Image"
            className="aspect-square h-full w-full rounded-sm"
          />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="hidden sm:inline-flex" />
    <CarouselNext className="hidden sm:inline-flex" />
  </Carousel>
);

export default ImageCarousel;
