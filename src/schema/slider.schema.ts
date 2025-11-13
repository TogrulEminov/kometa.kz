import z from "zod";

export const createSliderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageId: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadeSliderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreateSliderInput = z.infer<typeof createSliderSchema>;
export type UpdateSliderInput = z.infer<typeof uptadeSliderSchema>;
