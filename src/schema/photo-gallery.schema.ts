import z from "zod";

export const createPhotoesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageId: z.string().optional(),
  galleryIds: z.array(z.string()).optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadePhotoesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreatePhotoesInput = z.infer<typeof createPhotoesSchema>;
export type UpdatePhotoesInput = z.infer<typeof uptadePhotoesSchema>;
