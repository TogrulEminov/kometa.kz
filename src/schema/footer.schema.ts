import z from "zod";

export const mailSchema = z.object({
  title: z.string().min(1, "Title is required"),
  locale: z.enum(["az", "en", "ru"], "Dil düzgün seçilməyib"),
});

export type MailInput = z.infer<typeof mailSchema>;
