import z from "zod";

export const createContactEnumSchema = z.object({
  title: z.string().min(1, "Title is required"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadeContactEnumSchema = z.object({
  title: z.string().min(1, "Title is required"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreateContactEnumInput = z.infer<typeof createContactEnumSchema>;
export type UpdateContactEnumInput = z.infer<typeof uptadeContactEnumSchema>;
