"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import { Locales, Role } from "../../generated/prisma";
import { formatZodErrors } from "../../utils/format-zod-errors";
import { ImgInput, imgSchema } from "@/src/schema/img.schema";
import { createSlug } from "@/src/lib/slugifyHelper";
import { generateUUID } from "@/src/lib/uuidHelper";
import { UpsertAboutInput, upsertAboutSchema } from "@/src/schema/about.schema";
import { checkAuthServerAction } from "@/src/middleware/checkAuthorization";
import { revalidateAll } from "@/src/utils/revalidation";

type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  code: string;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

type GetProps = {
  locale: Locales;
};

export async function getAbout({ locale }: GetProps) {
  const existingItem = await db.about.findFirst({
    include: {
      imageUrl: {
        select: {
          id: true,
          fileKey: true,
          originalName: true,
          mimeType: true,
          publicUrl: true,
          fileSize: true,
        },
      },
      translations: {
        where: { locale },
      },
    },
  });

  return {
    message: "Success",
    data: existingItem,
  };
}

export async function upsertAbout(
  input: UpsertAboutInput
): Promise<ActionResult> {
  const { user, error } = await checkAuthServerAction([
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.CONTENT_MANAGER,
  ]);

  if (error || !user) {
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: error || "Giriş edilməyib",
    };
  }

  try {
    // Validate input
    const validateData = upsertAboutSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }

    const {
      title,
      description,
      locale,
      badge,
      subtitle,
      advantages,
      features,
      statistics,
    } = validateData.data;
    const custom_slug = createSlug(title);

    const result = await db.$transaction(async (prisma) => {
      // 1. Get or Create Hero record (only ONE should exist)
      let mainRecord = await prisma.about.findFirst({
        where: { isDeleted: false },
      });

      if (!mainRecord) {
        const uuid = generateUUID();
        mainRecord = await prisma.about.create({
          data: {
            documentId: uuid,
          },
        });
      } else {
        // Update slug on main record if title changes
        mainRecord = await prisma.about.update({
          where: { id: mainRecord.id },
          data: {
            documentId: mainRecord.documentId,
          },
        });
      }

      // 2. Upsert translation (automatically handles create/update)
      const translation = await prisma.aboutTranslations.upsert({
        where: {
          documentId_locale: {
            documentId: mainRecord.documentId,
            locale: locale,
          },
        },
        update: {
          title,
          description: description || "",
          badge,
          subtitle,
          slug: custom_slug,
          advantages: JSON.stringify(advantages),
          statistics: JSON.stringify(statistics),
          features: JSON.stringify(features),
        },
        create: {
          documentId: mainRecord.documentId,
          title,
          description: description || "",
          badge,
          subtitle,
          advantages: JSON.stringify(advantages),
          statistics: JSON.stringify(statistics),
          slug: custom_slug,
          locale: locale,
          features: JSON.stringify(features),
        },
      });

      // 3. Return complete data
      return {
        ...mainRecord,
        translations: [translation],
      };
    });
    revalidateAll();
    return {
      success: true,
      data: result,
      code: "SUCCESS",
      message: "Məlumat uğurla yadda saxlandı",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        success: false,
        error: "Məlumatlar düzgün deyil",
        errors: fieldErrors,
        code: "VALIDATION_ERROR",
      };
    }

    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Məlumat yadda saxlanarkən xəta baş verdi",
    };
  }
}
export async function updateAboutImage(
  id: string,
  input: ImgInput
): Promise<ActionResult> {
  const { user, error } = await checkAuthServerAction([
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.CONTENT_MANAGER,
  ]);

  if (error || !user) {
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: error || "Giriş edilməyib",
    };
  }
  try {
    const existingData = await db.about.findUnique({
      where: { documentId: id, isDeleted: false },
    });

    if (!existingData) {
      return { error: "Data not found", code: "NOT_FOUND", success: false };
    }

    const parsedInput = imgSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(parsedInput.error),
      };
    }

    const { imageId } = parsedInput.data;

    const updatedData = await db.about.update({
      where: { documentId: id },
      data: {
        imageId: Number(imageId),
      },
    });

    return {
      success: true,
      code: "SUCCESS",
      data: updatedData,
      message: "Şəkil uğurla yeniləndi",
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      success: false,
      code: "SERVER_ERROR",
      error: `Internal Server Error - ${errorMessage}`,
    };
  }
}
