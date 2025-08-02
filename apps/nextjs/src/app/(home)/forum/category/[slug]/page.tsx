import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";

import { Badge } from "@acme/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

import BackButton from "~/components/common/back-button";
import UserAvatar from "~/components/common/user-avatar";
import { StartDiscussion } from "~/components/forum/start-discussion";
import { api } from "~/trpc/server";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ForumCategoryPage({ params }: CategoryPageProps) {
  const slug = (await params).slug;
  const trpc = await api();

  // const posts = [];
  const categories = await trpc.forum.categoryList();
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) notFound();
  const posts = await trpc.forum.postsByCategory({ slug });

  return (
    <main className="space-y-4">
      <section className="flex justify-between gap-2 space-y-2 max-sm:flex-col">
        <div>
          <div className="flex items-center gap-2">
            <BackButton fallbackUrl="/forum" />
            <h1 className="text-3xl font-bold">{category.name}</h1>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {category.description}
          </p>
        </div>
        <div>
          <StartDiscussion categories={categories} category={category} />
        </div>
      </section>

      {posts.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">
          No posts yet in this category.
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="transition hover:shadow-sm">
              <Link href={`/forum/post/${post.id}`} className="block">
                <CardHeader>
                  <CardTitle className="truncate">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {post.content}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      className="size-6"
                      name={post.author?.name ?? ""}
                      imageUrl={post.author?.avatar}
                    />
                    <span>{post.author?.name}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 text-xs"
                  >
                    <MessageCircle className="h-4 w-4" /> {post.replyCount}
                  </Badge>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
