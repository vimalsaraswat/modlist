import { z } from "zod/v4";

const MAX_FILES = 5;
const allowedExtensions = [".jpg", ".jpeg", ".png", ".svg", ".gif", ".webp"];

export const addListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  makeId: z.number().int("Invalid make").positive("Invalid make"),
  modelId: z.number().int("Invalid model").positive("Invalid model"),
  categoryId: z.number().int("Invalid category").positive("Invalid category"),
  cityId: z.number().int("Invalid city").positive("Invalid city"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  imageUrls: z
    .array(
      z.url("Invalid image URL").refine(
        (url) => {
          return allowedExtensions.some((ext) =>
            url.toLowerCase().endsWith(ext),
          );
        },
        {
          message:
            "Only these types are allowed: .jpg, .jpeg, .png, .svg, .gif and .webp",
        },
      ),
    )
    .max(MAX_FILES)
    .optional(),
});

// Infer input type for TypeScript
export type AddListingInput = z.infer<typeof addListingSchema>;
