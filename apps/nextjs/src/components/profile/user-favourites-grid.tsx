import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@acme/ui/card";

import FavouriteButton from "../listings/favourite-button";

export default function UserFavoritesGrid({
  favourites,
}: {
  favourites: {
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
  }[];
}) {
  if (favourites.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card/30 p-12 text-center">
        <p className="text-muted-foreground">
          You haven’t saved any listings yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {favourites.map((item) => (
        <Link key={item.id} href={"/listings/" + item.id}>
          <Card className="overflow-hidden border-border bg-card/60 transition-all hover:bg-card/80">
            <div className="relative h-36">
              <Image
                src={item.imageUrl ?? ""}
                alt={item.title}
                width={300}
                height={150}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="mb-2 line-clamp-2 text-sm font-semibold">
                <Link href={`/listings/${item.id}`}>{item.title}</Link>
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  ₹{item.price.toLocaleString()}
                </span>
                <FavouriteButton
                  listingId={item.id}
                  initialIsFavourited={true}
                />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
