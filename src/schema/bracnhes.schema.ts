// src/schema/branch.schema.ts
import z from "zod";
import { Locales } from "../generated/prisma";

// Branch schemas
export const createBranchSchema = z.object({
  isoCode: z
    .string()
    .min(3, "ISO code must be 3 characters")
    .max(3, "ISO code must be 3 characters")
    .toUpperCase(),
  countryName: z.string().min(1, "Country name is required"),
  status: z.enum(["ACTIVE", "PLANNED"]).optional(),
  locale: z.enum(["az", "en", "ru"], { message: "Dil düzgün seçilməyib" }),
});

export const updateBranchSchema = z.object({
  countryName: z.string().min(1, "Country name is required"),
  status: z.enum(["ACTIVE", "PLANNED"]).optional(),
  locale: z.enum(["az", "en", "ru"], { message: "Dil düzgün seçilməyib" }),
});

// Office Schemas
export const createOfficeSchema = z.object({
  branchId: z.string().min(1, "Branch ID tələb olunur"),
  city: z.string().min(1, "Şəhər adı tələb olunur"),
  address: z.string().optional(),
  latitude: z.number().optional(),
  type: z.enum(["office", "warehouse"]).optional(),
  longitude: z.number().optional(),
  locale: z.nativeEnum(Locales),
});

export const updateOfficeSchema = z.object({
  city: z.string().min(1, "Şəhər adı tələb olunur"),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  locale: z.nativeEnum(Locales),
  type: z.enum(["office", "warehouse"]).optional(),
});

// Types
export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
export type CreateOfficeInput = z.infer<typeof createOfficeSchema>;
export type UpdateOfficeInput = z.infer<typeof updateOfficeSchema>;
