import z from "zod";
const tagSchema = z.object({
  title: z.string().optional(),
});
export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  tags: z.array(tagSchema).optional(),
  imageId: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], { message: "Dil düzgün seçilməyib" }),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  tags: z.array(tagSchema).optional(),
  locale: z.enum(["az", "en", "ru"], { message: "Dil düzgün seçilməyib" }),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
