import Link from "next/link";
import { BookOpen, Flame } from "lucide-react";

import { Badge } from "@acme/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

import UserAvatar from "~/components/common/user-avatar";
import { StartDiscussion } from "~/components/forum/start-discussion";
import { formatTimeAgo } from "~/lib/utils";
import { api } from "~/trpc/server";

export default async function ForumHomePage() {
  const trpc = await api();
  const categories = await trpc.forum.categoryList();
  const trending = await trpc.forum.trendingPosts();

  return (
    <main className="space-y-12">
      <section className="flex gap-2 space-y-2 max-sm:flex-col">
        <div className="mt-4 flex flex-wrap gap-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to the Modlist Community
          </h1>
          <p className="text-base text-muted-foreground">
            Discover builds, ask questions, and connect with fellow modders
            across the globe.
          </p>
        </div>
        <div className="float-right">
          <StartDiscussion categories={categories} />
        </div>
      </section>

      {trending.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold">Trending Discussions</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {trending.map((post) => (
              <Link href={`/forum/post/${post.id}`} key={post.id}>
                <Card className="transition hover:border-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="truncate text-base font-medium">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {post.content}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          className="size-6"
                          name={post.author?.name ?? ""}
                          imageUrl={post.author?.image}
                        />
                        <span>{post.author?.name}</span>
                      </div>{" "}
                      <span>{formatTimeAgo(post.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-semibold">Browse Categories</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Link key={cat.id} href={`/forum/category/${cat.slug}`}>
              <Card className="transition hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base font-medium">
                    <span>{cat.name}</span>
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
                    {cat.description}
                  </p>
                  {/*{cat?.postCount}*/}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
