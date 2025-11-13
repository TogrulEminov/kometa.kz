import z from "zod";

export const createFagSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadeFagSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreateFagInput = z.infer<typeof createFagSchema>;
export type UpdateFagInput = z.infer<typeof uptadeFagSchema>;
