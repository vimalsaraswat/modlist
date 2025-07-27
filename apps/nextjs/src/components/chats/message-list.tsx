"use client";

import { Fragment, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

interface Props {
  chatId: string;
  userId: string;
}

export default function MessageList({ chatId, userId }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  const { data: messages = [], isLoading } = useQuery({
    ...trpc.chat.getMessages.queryOptions({ chatId }),
    refetchInterval: 3000,
  });

  const groupedMsgs = useMemo(() => {
    const groups: Record<string, typeof messages> = {};

    messages.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();
      groups[dateKey] ??= [];
      groups[dateKey].push(msg);
    });

    return groups;
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <>
      {isLoading && (
        <p className="text-center text-muted-foreground">Loading...</p>
      )}
      {!isLoading && messages.length === 0 && (
        <p className="text-center text-muted-foreground">No messages yet</p>
      )}

      {Object.entries(groupedMsgs).map(([dateKey, msgs]) => (
        <Fragment key={dateKey}>
          <div className="my-4 text-center text-xs text-muted-foreground">
            <span className="inline-block rounded bg-muted px-3 py-1">
              {formatDateLabel(new Date(dateKey))}
            </span>
          </div>

          {msgs.map((msg) => {
            const isMe = msg.senderId === userId;

            return (
              <div
                key={msg.id}
                className={`max-w-[70%] break-words rounded-lg bg-secondary px-4 py-2 text-sm ${
                  isMe ? "ml-auto" : "mr-auto text-muted-foreground"
                }`}
              >
                {msg.type === "product" ? (
                  <ProductMessage
                    metadata={
                      msg.metadata as {
                        listingId: string;
                        title: string;
                        image: string;
                        description: string;
                      }
                    }
                  />
                ) : (
                  <>
                    {msg.text}
                    <div className="mt-1 text-right text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </Fragment>
      ))}
      <div ref={scrollRef} />
    </>
  );
}

function formatDateLabel(date: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ProductMessage({
  metadata,
}: {
  metadata: {
    listingId: string;
    title: string;
    image: string;
    description: string;
  };
}) {
  return (
    <Link
      href={`/listings/${metadata.listingId}`}
      className="block rounded-md border border-border bg-background text-foreground transition hover:bg-accent/50"
    >
      <div className="flex items-center gap-4 p-3">
        <Image
          src={metadata.image}
          alt={metadata.title}
          width={64}
          height={64}
          className="h-16 w-16 rounded-md object-cover"
        />
        <div className="flex-1">
          <h3 className="text-sm font-semibold">{metadata.title}</h3>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {metadata.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
