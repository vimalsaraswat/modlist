"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@acme/ui/carousel";

const ImageCarousel = ({ images }: { images: string[] }) => (
  <Carousel className="sm:mx-auto">
    <CarouselContent className="aspect-square sm:aspect-video">
      {images.map((image, index) => (
        <CarouselItem key={index}>
          <img
            src={image}
            alt="Product Preview Image"
            className="aspect-square h-full w-full rounded-sm object-cover"
          />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="left-0 hidden sm:inline-flex" />
    <CarouselNext className="right-0 hidden sm:inline-flex" />
  </Carousel>
);

export default ImageCarousel;
