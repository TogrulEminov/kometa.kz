import z from "zod";

export const upsertFeaturesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], { message: "Dil düzgün seçilməyib" }), // ✅ Fixed
});

export type UpsertFeaturesInput = z.infer<typeof upsertFeaturesSchema>;
