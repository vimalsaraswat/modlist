import Image from "next/image";
import Link from "next/link";
import { ClockIcon, MapPinIcon } from "lucide-react";

import { formatCurrency, formatDate } from "@acme/helpers";
import { Badge } from "@acme/ui/badge";
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
  status?:
    | "pending_review"
    | "draft"
    | "active"
    | "sold"
    | "expired"
    | "archived"
    | "rejected"
    | "deleted";
}

const statusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  pending_review: "secondary",
  draft: "outline",
  sold: "secondary",
  expired: "outline",
  archived: "outline",
  rejected: "destructive",
  deleted: "destructive",
};

const ListingCard = ({
  id,
  title,
  description,
  price,
  createdAt,
  category,
  city,
  imageUrl,
  status,
}: ListingCardProps) => (
  <Link href={`/listings/${id}`} className="place-self-stretch">
    <Card className="group h-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-md">
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
        {/* Category Badge (Top Left) */}
        {category && (
          <Badge className="absolute left-2 top-2" variant="secondary">
            {category}
          </Badge>
        )}
        {/* Status Badge (Top Right) */}
        {status && (
          <Badge
            className="absolute right-2 top-2"
            variant={statusColors[status]}
            aria-label={`Status: ${status}`}
          >
            {status.replace("_", " ")}
          </Badge>
        )}
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
            {formatCurrency(price)}
          </span>
          {city && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPinIcon size={14} /> <span>{city}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <ClockIcon size={14} />
          <span>{formatDate(new Date(createdAt))}</span>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default ListingCard;
