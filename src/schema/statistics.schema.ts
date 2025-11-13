import z from "zod";

export const createStatisticsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  count: z.number().min(1, "Count is required"),
  description: z.string().optional(),
  orderNumber: z.number().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export const uptadeStatisticsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  count: z.number().min(1, "Count is required"),
  orderNumber: z.number().optional(),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type CreateStatisticsInput = z.infer<typeof createStatisticsSchema>;
export type UpdateStatisticsInput = z.infer<typeof uptadeStatisticsSchema>;
