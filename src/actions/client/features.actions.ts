"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import { Locales, Role } from "../../generated/prisma";
import { formatZodErrors } from "../../utils/format-zod-errors";
import { VideoInput, videoSchema } from "@/src/schema/img.schema";
import { createSlug } from "@/src/lib/slugifyHelper";
import { generateUUID } from "@/src/lib/uuidHelper";
import {
  UpsertFeaturesInput,
  upsertFeaturesSchema,
} from "@/src/schema/features.schema";
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

export async function getFeatures({ locale }: GetProps) {
  const existingItem = await db.features.findFirst({
    include: {
      videoUrl: {
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

export async function upsertFeatures(
  input: UpsertFeaturesInput
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
    const validateData = upsertFeaturesSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }

    const { title, description, locale, subtitle } = validateData.data;

    const custom_slug = createSlug(title);

    const result = await db.$transaction(async (prisma) => {
      // 1. Get or Create Hero record (only ONE should exist)
      let mainRecord = await prisma.features.findFirst({
        where: { isDeleted: false },
      });

      if (!mainRecord) {
        const uuid = generateUUID();
        mainRecord = await prisma.features.create({
          data: {
            documentId: uuid,
          },
        });
      } else {
        // Update slug on main record if title changes
        mainRecord = await prisma.features.update({
          where: { id: mainRecord.id },
          data: {
            documentId: mainRecord.documentId,
          },
        });
      }

      // 2. Upsert translation (automatically handles create/update)
      const translation = await prisma.featuresTranslations.upsert({
        where: {
          documentId_locale: {
            documentId: mainRecord.documentId,
            locale: locale,
          },
        },
        update: {
          title,
          description: description || "",
          subtitle,
          slug: custom_slug,
        },
        create: {
          documentId: mainRecord.documentId,
          title,
          description: description || "",
          subtitle,
          slug: custom_slug,
          locale: locale,
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
    console.error("upsertHero error:", error);

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
export async function updateFeaturesVideo(
  id: string,
  input: VideoInput
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
    const existingData = await db.features.findUnique({
      where: { documentId: id, isDeleted: false },
    });

    if (!existingData) {
      return { error: "Data not found", code: "NOT_FOUND", success: false };
    }

    const parsedInput = videoSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(parsedInput.error),
      };
    }

    const { videoId } = parsedInput.data;

    const updatedData = await db.features.update({
      where: { documentId: id },
      data: {
        videoId: Number(videoId),
      },
    });
    revalidateAll();
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
