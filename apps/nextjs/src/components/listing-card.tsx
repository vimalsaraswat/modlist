"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, MapPin, ShoppingCart, Star, Zap } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";

interface ListingCardProps {
  listing: any;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="group overflow-hidden border-gray-700 bg-gray-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {listing.featured && (
          <Badge className="absolute left-2 top-2 border-0 bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <Zap className="mr-1 h-3 w-3" />
            Featured
          </Badge>
        )}
        {!listing.inStock && (
          <Badge className="absolute right-2 top-2 border-gray-600 bg-gray-800/90 text-gray-300">
            Out of Stock
          </Badge>
        )}
        <div className="absolute bottom-2 right-2 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-black/60 text-white backdrop-blur-sm hover:bg-red-500/20"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-black/60 text-white backdrop-blur-sm hover:bg-blue-500/20"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white transition-colors group-hover:text-red-400">
              <Link href={`/listing/${listing.id}`}>{listing.title}</Link>
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{listing.make}</span>
            <span>•</span>
            <span>{listing.model}</span>
            <span>•</span>
            <span>{listing.year}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3" />
            <span>{listing.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-red-500">
              ${listing.price.toLocaleString()}
            </span>
            <Badge
              variant="secondary"
              className="border-gray-600 bg-gray-800 text-xs text-gray-300"
            >
              {listing.condition}
            </Badge>
          </div>

          <div className="flex items-center justify-between border-t border-gray-700 pt-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 border border-gray-600">
                <AvatarImage src={listing.seller.avatar} />
                <AvatarFallback className="bg-gray-800 text-xs text-gray-300">
                  {listing.seller.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <p className="font-medium text-gray-300">
                  {listing.seller.name}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-400">{listing.seller.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Eye className="h-3 w-3" />
              <span>{listing.views}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
