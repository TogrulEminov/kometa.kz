import z from "zod";

export const createTestimonialsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  nameSurname: z.string().min(1, "Name Surname is required"),
  company: z.string().optional(),
  rate: z.number().min(1, "Rate is required"),
  imageId: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadeTestimonialsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  nameSurname: z.string().min(1, "Name Surname is required"),
  company: z.string().optional(),
  rate: z.number().min(1, "Rate is required"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreateTestimonialsInput = z.infer<typeof createTestimonialsSchema>;
export type UpdateTestimonialsInput = z.infer<typeof uptadeTestimonialsSchema>;
