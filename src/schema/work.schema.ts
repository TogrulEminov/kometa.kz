import z from "zod";

export const createWorkProcessSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  orderNumber: z.number().min(1, "Sıra nömrəsini qeyd et"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadeWorkProcessSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  orderNumber: z.number().min(1, "Sıra nömrəsini qeyd et"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreateWorkProcessInput = z.infer<typeof createWorkProcessSchema>;
export type UpdateWorkProcessInput = z.infer<typeof uptadeWorkProcessSchema>;
