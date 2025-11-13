import z from "zod";
export const createCertificatesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageId: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});
export const uptadeCertificatesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});
export type CreateCertificatesInput = z.infer<typeof createCertificatesSchema>;
export type UpdateCertificatesInput = z.infer<typeof uptadeCertificatesSchema>;
