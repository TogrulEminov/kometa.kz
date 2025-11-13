import z from "zod";
const advantageSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});
const statisticsSchema = z.object({
  title: z.string().optional(),
  count: z.string().optional(),
});
const featuresSchema = z.object({
  title: z.string().optional(),
});
export const upsertAboutSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  badge: z.string().min(1, "Badge is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  statistics: z.array(statisticsSchema).optional(),
  features: z.array(featuresSchema).optional(),
  advantages: z.array(advantageSchema).optional(),
  locale: z.enum(["az", "en", "ru"], { message: "Dil düzgün seçilməyib" }),
});

export type UpsertAboutInput = z.infer<typeof upsertAboutSchema>;
