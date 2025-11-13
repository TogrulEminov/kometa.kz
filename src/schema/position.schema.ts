import z from "zod";

export const createPositionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadePositionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreatePositionInput = z.infer<typeof createPositionSchema>;
export type UpdatePositionInput = z.infer<typeof uptadePositionSchema>;
