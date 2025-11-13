import z from "zod";

export const upsertContactSchema = z.object({
  phone: z.string().min(1, "Phone is required"),
  email: z.string().min(1, "Email is required"),
  phoneSecond: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  whatsapp: z.string().min(1, "Whatsapp number is required"),
  adressLink: z.string().min(1, "Adress link is required"),
  adress: z.string().min(1, "Adress is required"),
  workHours: z.string().min(1, "Work hours is required"),
  tag: z.string().optional(),
  support: z.string().min(1, "Support is required"),
  locale: z.enum(["az", "en", "ru"], { message: "Dil düzgün seçilməyib" }),
});

export type UpsertContactInput = z.infer<typeof upsertContactSchema>;
