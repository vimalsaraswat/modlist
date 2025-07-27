import type { TRPCRouterRecord } from "@trpc/server";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { z } from "zod/v4";

import { chat, chatMessage, chatParticipant, user } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

export const chatRouter = {
  create: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      const existingChat = await ctx.db.query.chat.findFirst({
        where: and(
          eq(chat.isGroup, false),
          inArray(
            chat.id,
            ctx.db
              .select({ chatId: chatParticipant.chatId })
              .from(chatParticipant)
              .where(eq(chatParticipant.userId, currentUserId)),
          ),
          inArray(
            chat.id,
            ctx.db
              .select({ chatId: chatParticipant.chatId })
              .from(chatParticipant)
              .where(eq(chatParticipant.userId, input.userId)),
          ),
        ),
      });
      if (existingChat) return { id: existingChat.id };

      const [created] = await ctx.db
        .insert(chat)
        .values({ isGroup: false })
        .returning({ id: chat.id });

      if (created) {
        await ctx.db.insert(chatParticipant).values([
          { chatId: created.id, userId: currentUserId },
          { chatId: created.id, userId: input.userId },
        ]);
      }
      return created;
    }),

  myChats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const chatIds = (
      await ctx.db
        .select({ chatId: chatParticipant.chatId })
        .from(chatParticipant)
        .where(eq(chatParticipant.userId, userId))
    ).map((cp) => cp.chatId);
    if (chatIds.length === 0) return [];

    return await ctx.db
      .select({
        id: chat.id,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        participantUser: {
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(chat)
      .leftJoin(chatParticipant, eq(chat.id, chatParticipant.chatId))
      .leftJoin(user, eq(chatParticipant.userId, user.id))
      .where(and(inArray(chat.id, chatIds), ne(user.id, userId)))
      .orderBy(desc(chat.updatedAt));
  }),

  byId: protectedProcedure
    .input(z.object({ chatId: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      const chatData = await ctx.db.query.chat.findFirst({
        where: eq(chat.id, input.chatId),
      });
      const isParticipant = await ctx.db.query.chatParticipant.findFirst({
        where: and(
          eq(chatParticipant.chatId, input.chatId),
          eq(chatParticipant.userId, currentUserId),
        ),
      });
      if (!chatData || !isParticipant)
        throw new Error("Unauthorized or chat not found");

      const participants = await ctx.db
        .select({
          userId: chatParticipant.userId,
          role: chatParticipant.role,
          user: {
            name: user.name,
            email: user.email,
            image: user.image,
          },
        })
        .from(chatParticipant)
        .leftJoin(user, eq(chatParticipant.userId, user.id))
        .where(eq(chatParticipant.chatId, input.chatId));

      return { chat: chatData, participants };
    }),

  getMessages: protectedProcedure
    .input(z.object({ chatId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      const isParticipant = await ctx.db.query.chatParticipant.findFirst({
        where: and(
          eq(chatParticipant.chatId, input.chatId),
          eq(chatParticipant.userId, currentUserId),
        ),
      });
      if (!isParticipant) throw new Error("Unauthorized");

      const messages = await ctx.db.query.chatMessage.findMany({
        where: eq(chatMessage.chatId, input.chatId),
        orderBy: desc(chatMessage.createdAt),
        limit: 50,
      });

      return messages.reverse();
    }),

  sendMessage: protectedProcedure
    .input(z.object({ chatId: z.uuid(), text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const senderId = ctx.session.user.id;
      const isParticipant = await ctx.db.query.chatParticipant.findFirst({
        where: and(
          eq(chatParticipant.chatId, input.chatId),
          eq(chatParticipant.userId, senderId),
        ),
      });
      if (!isParticipant) throw new Error("Unauthorized");

      const [message] = await ctx.db
        .insert(chatMessage)
        .values({
          chatId: input.chatId,
          senderId,
          text: input.text,
          type: "text",
        })
        .returning();

      return message;
    }),

  sendProductMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.uuid(),
        listingId: z.string(),
        title: z.string(),
        image: z.url(),
        description: z.string().max(250),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const senderId = ctx.session.user.id;
      const isParticipant = await ctx.db.query.chatParticipant.findFirst({
        where: and(
          eq(chatParticipant.chatId, input.chatId),
          eq(chatParticipant.userId, senderId),
        ),
      });
      if (!isParticipant) throw new Error("Unauthorized");

      const [message] = await ctx.db
        .insert(chatMessage)
        .values({
          chatId: input.chatId,
          senderId,
          type: "product",
          metadata: {
            listingId: input.listingId,
            title: input.title,
            image: input.image,
            description: input.description,
          },
        })
        .returning();

      return message;
    }),
} satisfies TRPCRouterRecord;
