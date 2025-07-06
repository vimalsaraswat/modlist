import { authRouter } from "./router/auth";
import { listingRouter } from "./router/listing";
import { postRouter } from "./router/post";
import { uploadRouter } from "./router/uploader";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  listing: listingRouter,
  uploader: uploadRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
