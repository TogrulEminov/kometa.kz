import z from "zod";

export const createSectionContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  subTitle: z.string().optional(),
  key: z.string().min(1, "Key is required"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadeSectionContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  subTitle: z.string().optional(),
  key: z.string().min(1, "Key is required"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreateSectionContentInput = z.infer<
  typeof createSectionContentSchema
>;
export type UpdateSectionContentInput = z.infer<
  typeof uptadeSectionContentSchema
>;
