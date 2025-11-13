import z from "zod";
const statisticsSchema = z.object({
  title: z.string().optional(),
  count: z.string().optional(),
});
const featuresSchema = z.object({
  title: z.string().optional(),
});
export const upsertHeroSchema = z.object({
  title: z.string().min(1, "Title is required"),
  badge: z.string().min(1, "Badge is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  highlightWord: z.string().min(1, "Highlight word is required"),
  primaryButton: z.string().min(1, "Primary button is required"),
  secondaryButton: z.string().min(1, "Secondary button is required"),
  features: z.array(featuresSchema).optional(),
  statistics: z.array(statisticsSchema).optional(),
  description: z.string().optional(),
  locale: z.enum(["az", "en", "ru"], { message: "Dil düzgün seçilməyib" }), // ✅ Fixed
});

export type UpsertHeroInput = z.infer<typeof upsertHeroSchema>;
