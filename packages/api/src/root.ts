import { adminRouter } from "./router/admin";
import { authRouter } from "./router/auth";
import { chatRouter } from "./router/chat";
import { forumRouter } from "./router/forum";
import { garageRouter } from "./router/garage";
import { listingRouter } from "./router/listing";
import { postRouter } from "./router/post";
import { reviewRouter } from "./router/review";
import { uploadRouter } from "./router/uploader";
import { waitlistRouter } from "./router/waitlist";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  auth: authRouter,
  chat: chatRouter,
  post: postRouter,
  forum: forumRouter,
  garage: garageRouter,
  review: reviewRouter,
  listing: listingRouter,
  uploader: uploadRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
