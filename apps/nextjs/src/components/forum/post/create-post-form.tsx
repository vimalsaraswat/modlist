"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/toast";

import { useTRPC } from "~/trpc/react";

const FormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(10, { message: "Content must be more detailed" }),
});

export function CreatePostForm({
  category,
  onSuccess,
}: {
  category: { id: string; slug: string; name: string };
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const form = useForm({
    schema: FormSchema,
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createPost = useMutation(
    trpc.forum.createPost.mutationOptions({
      onSuccess: () => {
        toast.success("Post created successfully!");
        form.reset();
        router.push(`/forum/category/${category.slug}`);
        onSuccess?.();
      },
      onError: (err) => {
        const message =
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to post"
            : "An error occurred while creating your post.";
        toast.error(message);
      },
    }),
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          createPost.mutate({ ...values, categoryId: category.id }),
        )}
        className="flex w-full max-w-2xl flex-col gap-5 rounded-md"
      >
        <h2 className="text-lg font-semibold text-foreground">
          Start a Discussion in{" "}
          <span className="text-primary">{category.name}</span>
        </h2>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="What would you like to discuss?"
                  disabled={createPost.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Write your thoughts, questions, or experience here..."
                  rows={8}
                  disabled={createPost.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createPost.isPending}>
          {createPost.isPending ? "Posting..." : "Post"}
        </Button>
      </form>
    </Form>
  );
}
