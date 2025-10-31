import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, Flame, MessageSquare, Users } from "lucide-react";

import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import { getSession } from "~/auth/server";
import UserAvatar from "~/components/common/user-avatar";
import { StartDiscussion } from "~/components/forum/start-discussion";
import { formatTimeAgo } from "~/lib/utils";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Modlist Community Forum",
  description:
    "Join the Modlist community to explore builds, ask questions, share experiences, and connect with fellow modders worldwide.",
  openGraph: {
    title: "Modlist Community Forum",
    description:
      "Explore trending discussions and dive into categories ranging from builds to troubleshooting and reviews.",
    url: "https://forum.modlist.shop/forum",
    siteName: "Modlist Forum",
    type: "website",
  },
};

export default async function ForumHomePage() {
  const session = await getSession();
  const trpc = await api();

  const [categories, trending, latest] = await Promise.all([
    trpc.forum.categoryList().catch(() => []),
    trpc.forum.trendingPosts().catch(() => []),
    trpc.forum.latestPosts().catch(() => []),
  ]);

  const hasCategories = categories.length > 0;

  return (
    <main className="space-y-12">
      {/* Header + Start Discussion */}
      <section className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to the Modlist Community
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Discover builds, ask questions, and connect with fellow modders
            across the globe.
          </p>
        </div>
        <div className="w-full md:w-auto">
          {session?.user ? (
            <StartDiscussion categories={categories} />
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Sign in to start a discussion
                </p>
                <Button asChild size="sm">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Trending / Latest with shadcn Tabs */}
      <section>
        <Tabs defaultValue="trending" className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Discussions</h2>
            </div>

            <TabsList className="grid h-9 w-[300px] grid-cols-2">
              <TabsTrigger
                value="trending"
                className="flex items-center gap-1.5"
              >
                <Flame className="h-3.5 w-3.5" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="latest" className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Latest
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Trending Tab */}
          <TabsContent value="trending" className="mt-0">
            {trending.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {trending.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyDiscussionsCard session={session} categories={categories} />
            )}
          </TabsContent>

          {/* Latest Tab */}
          <TabsContent value="latest" className="mt-0">
            {latest.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {latest.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyDiscussionsCard session={session} categories={categories} />
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Browse Categories */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Browse Categories</h2>
        {hasCategories ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Link key={cat.id} href={`/forum/category/${cat.slug}`}>
                <Card className="transition hover:border-primary hover:shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base font-medium">
                      <span className="truncate">{cat.name}</span>
                      <Badge variant="outline">
                        {i % 2 === 0 ? (
                          <Flame className="h-4 w-4 text-orange-500" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-sky-500" />
                        )}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {cat.description || "No description available."}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No categories available yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Check back soon — the community is growing!
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}

// Extracted Post Card
function PostCard({
  post,
}: {
  post: {
    id: string;
    title: string;
    content: string;
    viewCount: number;
    author: {
      name: string;
      image: string | null;
    } | null;
    createdAt: Date;
    replyCount: number;
  };
}) {
  return (
    <Link href={`/forum/post/${post.id}`}>
      <Card className="transition hover:border-primary hover:shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-1 text-base font-medium">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {post.content || "No preview available"}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <UserAvatar
                className="size-6"
                name={post.author?.name ?? "Anonymous"}
                imageUrl={post.author?.image}
              />
              <span>{post.author?.name ?? "Anonymous"}</span>
            </div>
            <span>{formatTimeAgo(post.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Extracted Empty State
function EmptyDiscussionsCard({
  session,
  categories,
}: {
  session: { user: { email: string } } | null;
  categories: { id: string; slug: string; name: string }[];
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <Flame className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No discussions yet.</p>
        <p className="text-xs text-muted-foreground">
          Be the first to spark a conversation!
        </p>
        {session?.user && <StartDiscussion categories={categories} />}
      </CardContent>
    </Card>
  );
}
