import z from "zod";

export const imgSchema = z.object({
  imageId: z.string().min(1, "Şəkil yükləyin"),
});
export const iconsSchema = z.object({
  iconsId: z.string().min(1, "Şəkil yükləyin"),
});
export const videoSchema = z.object({
  videoId: z.string().min(1, "Şəkil yükləyin"),
});
export const gallerySchema = z.object({
  galleryIds: z.array(z.string()).min(1, "Ən azı bir şəkil yükləyin"),
});
export type ImgInput = z.infer<typeof imgSchema>;
export type IconsInput = z.infer<typeof iconsSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
