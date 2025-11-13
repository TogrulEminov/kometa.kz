import { z } from "zod";
import { Status } from "../generated/prisma";

export const createSocialSchema = z.object({
  socialName: z
    .string()
    .min(2, "Sosial şəbəkə adı minimum 2 simvol olmalıdır")
    .max(50, "Sosial şəbəkə adı maksimum 50 simvol ola bilər"),
  socialLink: z
    .string()
    .url("Düzgün URL daxil edin")
    .min(1, "Link tələb olunur"),
  iconName: z.string().min(1, "Icon adı tələb olunur"),
  status: z.nativeEnum(Status).optional(),
});

export const updateSocialSchema = z.object({
  socialName: z
    .string()
    .min(2, "Sosial şəbəkə adı minimum 2 simvol olmalıdır")
    .max(50, "Sosial şəbəkə adı maksimum 50 simvol ola bilər")
    .optional(),
  socialLink: z.string().url("Düzgün URL daxil edin").optional(),
  iconName: z.string().min(1, "Icon adı tələb olunur").optional(),
  status: z.nativeEnum(Status).optional(),
});

export type CreateSocialInput = z.infer<typeof createSocialSchema>;
export type UpdateSocialInput = z.infer<typeof updateSocialSchema>;
