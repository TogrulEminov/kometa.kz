import z from "zod";

export const createCallActionSchema = z.object({
  category: z.string().min(1, "Category is required"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().min(1, "Phone is required"),
  typesProduct: z.string().min(1, "Type is required"),
  weight: z.string().min(1, "Weight is required"),
  dimensions: z.string().min(1, "Dimensions is required"),
});
export const heroModalSchema = z.object({
  category: z.string().min(1, "Kategoriyanı seçin"),
  assignedTo: z.string().min(1, "Cavablayacaq şəxsi seçin"),
  fullName: z.string().min(2, "Ad və soyadı daxil edin"),
  email: z.string().email("Düzgün email daxil edin"),
  phone: z.string().min(10, "Telefon nömrəsini daxil edin"),
  typesProduct: z.string().min(2, "Malın növünü daxil edin"),
  weight: z.string().min(1, "Çəkini daxil edin"),
  dimensions: z.string().min(1, "Ölçüləri daxil edin"),
  message: z.string().optional(),
});
export const servicesModalSchema = z.object({
  category: z.string().min(1, "Kategoriyanı seçin"),
  assignedTo: z.string().min(1, "Cavablayacaq şəxsi seçin"),
  fullName: z.string().min(2, "Ad və soyadı daxil edin"),
  email: z.string().email("Düzgün email daxil edin"),
  phone: z.string().min(10, "Telefon nömrəsini daxil edin"),
  typesProduct: z.string().min(2, "Malın növünü daxil edin"),
  weight: z.string().min(1, "Çəkini daxil edin"),
  dimensions: z.string().min(1, "Ölçüləri daxil edin"),
  message: z.string().optional(),
});

export const contactSchema = z.object({
  fullName: z.string().min(3, { message: "Tam ad minimum 3 simvol olmalıdır" }),
  email: z.string().email({ message: "Düzgün email adresi daxil edin" }),
  phone: z
    .string()
    .min(7, { message: "Telefon nömrəsi düzgün daxil edilməlidir" }),
  subject: z.string().min(1, { message: "Mövzu seçilməlidir" }),
  message: z.string().optional(),
});
export type CreateCallActionInput = z.infer<typeof createCallActionSchema>;
export type CreateModalInput = z.infer<typeof heroModalSchema>;
export type CreateModalServicesInput = z.infer<typeof servicesModalSchema>;
export type CreateContactInput = z.infer<typeof contactSchema>;
