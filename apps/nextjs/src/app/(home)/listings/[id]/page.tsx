import { notFound } from "next/navigation";
import { Calendar, MapPin, MessageCircle, Wrench } from "lucide-react";
import { z } from "zod/v4";

import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { Tabs, TabsContent } from "@acme/ui/tabs";

import { getSession } from "~/auth/server";
import ImageCarousel from "~/components/common/image-carousel";
import ShareButton from "~/components/common/share-button";
import UserAvatar from "~/components/common/user-avatar";
import FavouriteButton from "~/components/listings/favourite-button";
import { api } from "~/trpc/server";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  const { id } = await params;
  if (!id || !z.uuid().safeParse(id).success) return notFound();

  const trpc = await api();
  const listing = await trpc.listing.byId({ id });
  if (!listing) return notFound();

  return (
    <main className="min-h-dvh">
      <div className="relative overflow-hidden">
        {/* <div className="!duration-[5000] absolute inset-0 animate-pulse bg-accent/10"></div> */}
        <div className="absolute inset-0 bg-accent/5"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left/Main */}
            <div className="space-y-6 lg:col-span-2">
              <Card className="overflow-hidden border-border bg-card backdrop-blur-sm">
                <CardContent className="p-0">
                  <ImageCarousel images={listing.images} />
                </CardContent>
              </Card>

              <Card className="border-border bg-card backdrop-blur-sm">
                <CardHeader className="border-b border-border">
                  <div className="flex items-start justify-between max-sm:flex-col">
                    <div className="flex-1">
                      <CardTitle className="mb-3 text-3xl font-bold text-foreground">
                        {listing.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <Badge className="bg-primary text-primary-foreground">
                          {listing.category}
                        </Badge>
                        <div className="flex items-center">
                          <MapPin className="mr-1" />
                          <span>{listing.city}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1" />
                          <span>{listing.createdAt.toLocaleDateString()}</span>
                        </div>
                        {/* <Badge
                          variant="outline"
                          className="border-destructive text-destructive-foreground"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </Badge> */}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 self-stretch">
                      {session?.user && (
                        <FavouriteButton
                          listingId={listing.id}
                          initialIsFavourited={listing.isFavourite}
                        />
                      )}
                      <ShareButton
                        title={`${listing.title} | ModMarket`}
                        text={listing.description}
                        url={"/listings/" + listing.id}
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <Tabs defaultValue="description" className="w-full">
                    {/* <TabsList className="grid w-full grid-cols-3 bg-muted">
                      {["description", "compatibility", "performance"].map(
                        (v) => (
                          <TabsTrigger
                            key={v}
                            value={v}
                            className="data-[state=active]:bg-primary/20"
                          >
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                          </TabsTrigger>
                        ),
                      )}
                    </TabsList> */}

                    <TabsContent
                      value="description"
                      className="prose prose-invert text-muted-foreground"
                    >
                      <p>{listing.description}</p>
                      {/* <div className="mt-4 flex flex-wrap gap-2">
                        {[
                          {
                            icon: Star,
                            label: "Premium Grade",
                            color: "yellow",
                          },
                          { icon: Star, label: "OEM Quality", color: "blue" },
                          {
                            icon: Star,
                            label: "Track Tested",
                            color: "purple",
                          },
                        ].map(({ icon: Icon, label, color }) => (
                          <Badge
                            key={label}
                            variant="outline"
                            className={`border-${color}-500/30 text-${color}-400`}
                          >
                            <Icon className="mr-1 h-3 w-3" /> {label}
                          </Badge>
                        ))}
                      </div> */}
                    </TabsContent>

                    <TabsContent value="compatibility" className="mt-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-muted/50 p-4">
                            <h4 className="font-semibold text-green-400">
                              ✓ Compatible
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Honda Civic Si (2006-2011)
                            </p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-4">
                            <h4 className="font-semibold text-yellow-400">
                              ⚠ Check Fitment
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Honda Civic Type R (2007-2010)
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="performance" className="mt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                          <h4 className="font-semibold text-destructive">
                            Power Gain
                          </h4>
                          <p className="text-2xl font-bold text-foreground">
                            +25 HP
                          </p>
                        </div>
                        <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
                          <h4 className="font-semibold text-primary">
                            Torque Gain
                          </h4>
                          <p className="text-2xl font-bold text-foreground">
                            +30 lb-ft
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="border-border bg-card backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Wrench className="text-destructive" /> Technical
                    Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {[
                      ["Make", listing.make],
                      ["Model", listing.model],
                      ["Category", listing.category],
                      ["Location", listing.city],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between border-b border-border py-2"
                      >
                        <span className="text-sm text-muted-foreground">
                          {label}
                        </span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <Card className="border-border bg-card backdrop-blur-sm">
                <CardHeader className="border-b border-border">
                  <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold text-transparent">
                    ₹{listing.price.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center space-x-3">
                    <UserAvatar
                      name={listing.user?.name ?? ""}
                      imageUrl={listing.user?.image}
                    />
                    <div>
                      {listing.user?.name && (
                        <p className="font-semibold">{listing.user.name}</p>
                      )}
                      <div className="flex items-center gap-2">
                        {listing.user?.createdAt && (
                          <span className="text-xs text-muted-foreground">
                            Since{" "}
                            {new Date(listing.user.createdAt).getFullYear()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {session?.user ? (
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Seller
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Sign In to contact seller!
                    </Button>
                  )}

                  {/* <Separator className="bg-border" /> */}
                  <div className="space-y-4">
                    {/* <div className="flex items-center space-x-3">
                      <UserAvatar
                        name={listing.user?.name ?? ""}
                        imageUrl={listing.user?.image}
                      />
                      <div>
                        {listing.user?.name && (
                          <p className="font-semibold">{listing.user.name}</p>
                        )}
                        <div className="flex items-center gap-2">
                          {listing.user?.createdAt && (
                            <span className="text-xs text-muted-foreground">
                              Since{" "}
                              {new Date(listing.user.createdAt).getFullYear()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="grid grid-cols-3 gap-4 text-center">
                      {[
                        ["Views", "127", "red-400"],
                        ["Saves", "8", "orange-400"],
                        ["Rating", "4.9", "green-400"],
                      ].map(([label, value, color]) => (
                        <div key={label} className="rounded-lg bg-muted/50 p-3">
                          <p className={`text-2xl font-bold text-${color}`}>
                            {value}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              {/* <Card className="border-border bg-card backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <ShieldCheck className="text-primary-foreground" /> Buyer
                    Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  {[
                    {
                      title: "• Meet in a public place",
                      desc: "Always arrange to meet in a busy and public location to ensure your safety and avoid scams.",
                    },
                    {
                      title: "• Inspect parts thoroughly",
                      desc: "Carefully examine all components for any signs of damage or tampering before finalizing the purchase.",
                    },
                    {
                      title: "• Verify compatibility",
                      desc: "Double-check that the parts are suitable for your equipment to prevent future issues.",
                    },
                    {
                      title: "• Use secure payment methods",
                      desc: "Complete transactions using trusted and secure payment options to protect your financial information.",
                    },
                    {
                      title: "• Trust your instincts",
                      desc: "If something feels off about the deal or the seller, reconsider the transaction.",
                    },
                  ].map(({ title, desc }) => (
                    <div key={title} className="">
                      <p className="text-sm font-medium">{title}</p>
                      <p className="text-xs">{desc}</p>
                    </div>
                  ))}
                </CardContent>
              </Card> */}

              {/* <Card className="border-border bg-accent/10 backdrop-blur-sm">
                <CardContent className="p-4 text-center text-foreground">
                  <Zap className="mx-auto text-primary" />
                  <h3 className="font-bold">Performance Boost</h3>
                  <p className="text-sm text-muted-foreground">
                    This part can increase performance by up to 15%
                  </p>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
