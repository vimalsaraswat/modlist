import { authRouter } from "./router/auth";
import { chatRouter } from "./router/chat";
import { listingRouter } from "./router/listing";
import { postRouter } from "./router/post";
import { uploadRouter } from "./router/uploader";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  chat: chatRouter,
  listing: listingRouter,
  uploader: uploadRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
