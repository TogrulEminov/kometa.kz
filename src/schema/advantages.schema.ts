import z from "zod";

export const createAdvantagesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageId: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadeAdvantagesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreateAdvantagesInput = z.infer<typeof createAdvantagesSchema>;
export type UpdateAdvantagesInput = z.infer<typeof uptadeAdvantagesSchema>;
