import z from "zod";

export const createYoutubeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().min(1, "Youtube link is required"),
  imageId: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadeYoutubeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().min(1, "Youtube link is required"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreateYoutubeInput = z.infer<typeof createYoutubeSchema>;
export type UpdateYoutubeInput = z.infer<typeof uptadeYoutubeSchema>;
