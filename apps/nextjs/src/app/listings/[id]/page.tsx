import { notFound } from "next/navigation";
import { Calendar, Heart, MapPin, MessageCircle, Share } from "lucide-react";

import { Avatar, AvatarFallback } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

import ImageCarousel from "~/app/_components/common/image-carousel";
import ShareButton from "~/app/_components/common/share-button";
import UserAvatar from "~/app/_components/common/user-avatar";
import { api } from "~/trpc/server";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // console.log(z.uuid().safeParse(id));
  const trpc = await api();
  const listing = await trpc.listing.byId({ id });

  if (!listing) return notFound();

  return (
    <main className="min-h-screen bg-zinc-900 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Images */}
            <Card>
              <CardContent className="p-6">
                <ImageCarousel images={listing.images} />
                {/* <ImageCarousel images={listing.images} title={listing.title} /> */}
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-2 text-2xl">
                      {listing.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Badge variant="secondary">{listing.category}</Badge>
                      {/* <Badge variant="outline">{listing.condition}</Badge> */}
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {/* {listing.city} */}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {listing.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <ShareButton
                      title={listing.title + " | " + "Modlist"}
                      text={listing.description}
                      url={"/listings/" + listing.id}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="leading-relaxed text-gray-700">
                    {listing.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Make</span>
                    <p className="font-semibold">{listing.make}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Model</span>
                    <p className="font-semibold">{listing.model}</p>
                  </div>
                  {/* <div>
                    <span className="text-sm text-gray-600">Year</span>
                    <p className="font-semibold">{listing.year}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Condition</span>
                    <p className="font-semibold capitalize">
                      {listing.condition}
                    </p>
                  </div> */}
                  <div>
                    <span className="text-sm text-gray-600">Category</span>
                    <p className="font-semibold capitalize">
                      {listing.category}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Location</span>
                    <p className="font-semibold">{listing.city}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Contact */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-3xl text-red-600">
                  ₹{listing.price.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  // onClick={handleMessageSeller}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message Seller
                </Button>

                <Button variant="outline" className="w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Save to Favorites
                </Button>

                <div className="border-t pt-4">
                  <div className="flex items-center space-x-3">
                    <UserAvatar
                      name={listing.user?.name ?? ""}
                      imageUrl={listing.user?.image}
                    />
                    <div>
                      {listing.user?.name && (
                        <p className="font-semibold">{listing.user.name}</p>
                      )}
                      {listing.user?.createdAt && (
                        <p className="text-sm text-muted-foreground">
                          Member since{" "}
                          {new Date(listing.user.createdAt).getFullYear()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">127</p>
                    <p className="text-sm text-muted-foreground">Views</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Saves</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="sticky top-[30rem]">
              <CardHeader>
                <CardTitle className="text-lg">Safety Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Meet in a public place</p>
                <p>• Inspect parts thoroughly</p>
                <p>• Verify compatibility</p>
                <p>• Use secure payment methods</p>
                <p>• Trust your instincts</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
