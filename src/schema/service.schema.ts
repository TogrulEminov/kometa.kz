import z from "zod";
const features = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});
const advantages = z.object({
  title: z.string().optional(),
});
export const createServicesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  orderNumber: z.number().min(1, "Sıra nömrəsini qeyd et"),
  fags: z.array(features).optional(),
  features: z.array(features).optional(),
  advantages: z.array(advantages).optional(),
  imageId: z.string().optional(),
  iconsId: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], { message: "Dil düzgün seçilməyib" }),
});

export const updateServicesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  fags: z.array(features).optional(),
  orderNumber: z.number().min(1, "Sıra nömrəsini qeyd et"),
  features: z.array(features).optional(),
  advantages: z.array(advantages).optional(),
  locale: z.enum(["az", "en", "ru"], { message: "Dil düzgün seçilməyib" }),
});

export type CreateServicesInput = z.infer<typeof createServicesSchema>;
export type UpdateServicesInput = z.infer<typeof updateServicesSchema>;
