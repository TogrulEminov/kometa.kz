"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import { Locales, Role } from "../../generated/prisma";
import { formatZodErrors } from "../../utils/format-zod-errors";
import { generateUUID } from "@/src/lib/uuidHelper";
import {
  UpsertContactInput,
  upsertContactSchema,
} from "@/src/schema/contact.schema";
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

export async function getContact({ locale }: GetProps) {
  const existingItem = await db.contactInformation.findFirst({
    include: {
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

export async function upsertContact(
  input: UpsertContactInput
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
    const validateData = upsertContactSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }

    const {
      phone,
      phoneSecond,
      email,
      whatsapp,
      adressLink,
      adress,
      workHours,
      tag,
      support,
      locale,
      title,
      description,
      longitude,
      latitude,
    } = validateData.data;

    const result = await db.$transaction(async (prisma) => {
      // 1. Get or Create Hero record (only ONE should exist)
      let mainRecord = await prisma.contactInformation.findFirst({
        where: { isDeleted: false },
      });

      if (!mainRecord) {
        const uuid = generateUUID();
        mainRecord = await prisma.contactInformation.create({
          data: {
            documentId: uuid,
            phone,
            email,
            phoneSecond,
            adressLink,
            whatsapp,
          },
        });
      } else {
        // Update slug on main record if title changes
        mainRecord = await prisma.contactInformation.update({
          where: { id: mainRecord.id },
          data: {
            documentId: mainRecord.documentId,
            phone,
            email,
            latitude: latitude as any,
            longitude: longitude as any,
            phoneSecond,
            adressLink,
            whatsapp,
          },
        });
      }

      // 2. Upsert translation (automatically handles create/update)
      const translation = await prisma.contactInformationTranslation.upsert({
        where: {
          documentId_locale: {
            documentId: mainRecord.documentId,
            locale: locale,
          },
        },
        update: {
          workHours,
          tag,
          support,
          adress,
          title,
          description,
        },
        create: {
          documentId: mainRecord.documentId,
          workHours,
          tag,
          adress,
          title,
          description,
          support,
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
