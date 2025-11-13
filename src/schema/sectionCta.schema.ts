import z from "zod";

export const createSectionCtaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  subTitle: z.string().optional(),
  key: z.string().min(1, "Key is required"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadeSectionCtaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  subTitle: z.string().optional(),
  key: z.string().min(1, "Key is required"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreateSectionCtaInput = z.infer<typeof createSectionCtaSchema>;
export type UpdateSectionCtaInput = z.infer<typeof uptadeSectionCtaSchema>;
