import z from "zod";

export const createPartnersSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().optional(),
  imageId: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadePartnersSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreatePartnersInput = z.infer<typeof createPartnersSchema>;
export type UpdatePartnersInput = z.infer<typeof uptadePartnersSchema>;
