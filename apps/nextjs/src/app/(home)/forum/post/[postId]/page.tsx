import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Card, CardContent } from "@acme/ui/card";
import { Separator } from "@acme/ui/separator";

import BackButton from "~/components/common/back-button";
import { ReplyForm } from "~/components/forum/post/reply-form";
import { formatTimeAgo } from "~/lib/utils";
import { api } from "~/trpc/server";

interface PostPageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default async function ForumPostPage({ params }: PostPageProps) {
  const postId = (await params).postId;

  const trpc = await api();
  const postData = await trpc.forum.postById({ postId });

  if (!postData) return notFound();

  const { post, replies } = postData;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <BackButton fallbackUrl="/forum" />
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        </div>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author?.avatar ?? undefined} />
            <AvatarFallback>
              {post.author?.name[0]?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span>{post.author?.name}</span>
          <Separator orientation="vertical" className="h-4" />
          <span>{formatTimeAgo(new Date(post.createdAt))}</span>
        </div>
      </div>

      <Card>
        <CardContent className="prose dark:prose-invert max-w-none p-6">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>
      </Card>

      <div>
        <div className="mt-6">
          <ReplyForm postId={postId} />
        </div>
        <h2 className="mb-4 text-xl font-semibold">
          Replies ({replies.length})
        </h2>

        <div className="space-y-4">
          {replies.length === 0 ? (
            <p className="text-muted-foreground">
              No replies yet. Be the first to respond!
            </p>
          ) : (
            replies.map((reply) => (
              <div
                key={reply.id}
                className="rounded-lg border bg-muted p-4 shadow-sm transition hover:shadow"
              >
                <div className="mb-2 flex items-center gap-3 text-sm text-muted-foreground">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reply.author?.avatar ?? undefined} />
                    <AvatarFallback>
                      {reply.author?.name[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{reply.author?.name}</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>{formatTimeAgo(reply.createdAt)}</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {reply.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
