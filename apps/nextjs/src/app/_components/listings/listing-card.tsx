import Image from "next/image";
import Link from "next/link";
import { ClockIcon, MapPinIcon } from "lucide-react";

import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";

interface ListingCardProps {
  id: string;
  title: string;
  description?: string;
  price: number;
  createdAt: Date;
  category?: string | null;
  city?: string | null;
  imageUrl?: string | null;
}

const ListingCard = ({
  id,
  title,
  description,
  price,
  createdAt,
  category,
  city,
  imageUrl,
}: ListingCardProps) => (
  <Link href={`/listings/${id}`} className="place-self-stretch">
    <Card className="group h-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.01]">
      <div className="relative overflow-hidden rounded-t-lg">
        {imageUrl ? (
          <Image
            height={400}
            width={400}
            src={imageUrl}
            alt={title}
            className="h-48 w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-secondary text-secondary-foreground">
            No Image
          </div>
        )}
        <Badge className="absolute left-2 top-2" variant="secondary">
          {category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 font-bold">{title}</h3>
        {description && (
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-bold text-accent">
            ₹{price.toLocaleString()}
          </span>
          {city && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPinIcon size={14} /> <span>{city}</span>
            </div>
          )}
        </div>
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ClockIcon size={14} />
            <span>
              {new Date(createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          {/* <Button size="icon" variant="ghost">
            <ClockIcon size={16} />
          </Button> */}
        </div>
        <Button asChild variant="secondary" className="w-full">
          {/* <a href="#" onClick={(e) => e.preventDefault()}> */}
          Message Seller
          {/* </a> */}
        </Button>
      </CardContent>
    </Card>
  </Link>
);

export default ListingCard;
