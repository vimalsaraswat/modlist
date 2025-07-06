import type { TRPCRouterRecord } from "@trpc/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod/v4";

import { apiEnv } from "../../env";
import { S3 } from "../lib/s3-client";
import { protectedProcedure } from "../trpc";

export const uploadRouter = {
  getPreSignedUrl: protectedProcedure
    .input(
      z.object({
        mimeType: z.string(),
        fileName: z.string(),
        fileSize: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const { fileName, fileSize, mimeType } = input;
      const extension = fileName.split(".").pop() ?? "";
      const id = crypto.randomUUID();
      const attachmentKey = `modlist/${id}${extension ? `.${extension}` : ""}`;

      const command = new PutObjectCommand({
        Bucket: apiEnv().S3_BUCKET_NAME,
        Key: attachmentKey,
        ContentType: mimeType,
        ContentLength: fileSize,
      });

      const presignedUrl = await getSignedUrl(S3, command, {
        expiresIn: 60 * 6,
      });

      return {
        presignedUrl,
        key: attachmentKey,
      };
    }),
} satisfies TRPCRouterRecord;
