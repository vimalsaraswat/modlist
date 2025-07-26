import type { TRPCRouterRecord } from "@trpc/server";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { z } from "zod/v4";

import { chat, chatMessage, chatParticipant, user } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

// Schemas
const CreateChatSchema = z.object({
  userId: z.string(),
});

const SendMessageSchema = z.object({
  chatId: z.uuid(),
  text: z.string().min(1),
});

const GetMessagesSchema = z.object({
  chatId: z.uuid(),
});

const GetChatSchema = z.object({
  chatId: z.uuid(),
});

export const chatRouter = {
  // Create a chat (1-on-1 or group)
  create: protectedProcedure
    .input(CreateChatSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      const currentUserId = ctx.session.user.id;

      // Check if a one-on-one chat already exists between the two users
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
              .where(eq(chatParticipant.userId, userId)),
          ),
        ),
      });

      if (existingChat) {
        return {id: existingChat.id};
      }

      // Create a new one-on-one chat
      const [createdChat] = await ctx.db
        .insert(chat)
        .values({
          name: null,
          isGroup: false,
        })
        .returning({ id: chat.id });

      if (createdChat?.id) {
        await ctx.db.insert(chatParticipant).values([
          {
            chatId: createdChat.id,
            userId: currentUserId,
          },
          {
            chatId: createdChat.id,
            userId: userId,
          },
        ]);
      }

      return createdChat;
    }),

  myChats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const userChatParticipants = await ctx.db
      .select({ chatId: chatParticipant.chatId })
      .from(chatParticipant)
      .where(eq(chatParticipant.userId, userId));

    const chatIds = userChatParticipants.map((cp) => cp.chatId);

    if (chatIds.length === 0) {
      return [];
    }

    const chatsWithParticipant = await ctx.db
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

    return chatsWithParticipant;
  }),

  byId: protectedProcedure
    .input(GetChatSchema)
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

      if (!chatData || !isParticipant) {
        throw new Error("Unauthorized or chat not found");
      }

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

  // Send a message
  sendMessage: protectedProcedure
    .input(SendMessageSchema)
    .mutation(async ({ ctx, input }) => {
      const { chatId, text } = input;
      const senderId = ctx.session.user.id;

      // Ensure user is a participant in the chat
      const isParticipant = await ctx.db.query.chatParticipant.findFirst({
        where: and(
          eq(chatParticipant.chatId, chatId),
          eq(chatParticipant.userId, senderId),
        ),
      });

      if (!isParticipant) {
        throw new Error("Unauthorized");
      }

      // Insert the message
      const [newMessage] = await ctx.db
        .insert(chatMessage)
        .values({
          chatId,
          senderId,
          text,
        })
        .returning();

      return newMessage;
    }),

  getMessages: protectedProcedure
    .input(GetMessagesSchema)
    .query(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;

      // Check access
      const isParticipant = await ctx.db.query.chatParticipant.findFirst({
        where: and(
          eq(chatParticipant.chatId, input.chatId),
          eq(chatParticipant.userId, currentUserId),
        ),
      });

      if (!isParticipant) {
        throw new Error("Unauthorized");
      }

      const messages = await ctx.db.query.chatMessage.findMany({
        where: eq(chatMessage.chatId, input.chatId),
        orderBy: desc(chatMessage.createdAt),
        limit: 50,
      });

      return messages.reverse(); // oldest to newest
    }),
} satisfies TRPCRouterRecord;
