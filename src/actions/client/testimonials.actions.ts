"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import { Locales, Prisma, Role } from "../../generated/prisma";
import { isUuid } from "../../utils/checkSlug";
import { formatZodErrors } from "../../utils/format-zod-errors";
import { ImgInput, imgSchema } from "@/src/schema/img.schema";

import { createSlug } from "@/src/lib/slugifyHelper";
import {
  CreateTestimonialsInput,
  createTestimonialsSchema,
  UpdateTestimonialsInput,
  uptadeTestimonialsSchema,
} from "@/src/schema/testimonials.schema";
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
  page?: number;
  query?: string;
  pageSize?: number;
  locale: Locales;
};
type GetByIDProps = {
  id: string;
  locale: Locales;
};
export async function getTestimonials({
  page,
  pageSize,
  query,
  locale,
}: GetProps) {
  const customPage = Number(page) || Number(1);
  const customPageSize = Number(pageSize) || Number(12);
  const skip = 0;
  const take = Number(customPage) * customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.TestimonialsWhereInput = {
    isDeleted: false,
    translations: {
      some: {
        locale: locale,
        ...(searchTerm && {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        }),
      },
    },
  };
  const [data, totalCount] = await Promise.all([
    db.testimonials.findMany({
      where: whereClause,
      select: {
        status: true,
        documentId: true,
        id: true,
        rate: true,
        company: true,
        imageUrl: {
          select: {
            id: true,
            publicUrl: true,
            fileKey: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        translations: {
          where: {
            locale: locale,
          },
          select: {
            slug: true,
            id: true,
            locale: true,
            nameSurname: true,
            description: true,
            title: true,
            documentId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    }),
    db.testimonials.count({ where: whereClause }),
  ]);
  const totalPages = Math.ceil(totalCount / customPageSize);
  return {
    message: "Success",
    data: totalCount < 1 ? [] : data,
    paginations: {
      page,
      pageSize: customPageSize,
      totalPages: totalPages,
      dataCount: totalCount,
    },
  };
}

export async function getTestimonialsById({ locale, id }: GetByIDProps) {
  try {
    const byUuid = isUuid(id);
    const whereClause = byUuid
      ? {
          isDeleted: false,
          documentId: id,
        }
      : {
          isDeleted: false,
          translations: {
            some: { slug: id, locale },
          },
        };

    const existingData = await db.testimonials.findFirst({
      where: whereClause,
      include: {
        imageUrl: {
          select: {
            id: true,
            publicUrl: true,
            fileKey: true,
          },
        },
        translations: {
          where: { locale },
        },
      },
    });

    if (!existingData) {
      return { message: "Data not found", code: "NOT_FOUND" };
    }
    return { data: existingData };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return { message: `Internal Server Error - ${errorMessage}` };
  }
}
export async function createTestimonials(
  input: CreateTestimonialsInput
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
    const validateData = createTestimonialsSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }
    const { title, description, locale, imageId, nameSurname, company, rate } =
      validateData.data;
    const rateNumber = rate;
    if (isNaN(rateNumber) || rateNumber < 1 || rateNumber > 5) {
      return {
        success: false,
        error: "Rate 1 və 5 arasında olmalıdır",
        code: "VALIDATION_ERROR",
      };
    }

    const customSlug = createSlug(title);
    const existingData = await db.testimonials.findFirst({
      where: {
        isDeleted: false,
        translations: {
          some: { locale: locale, slug: customSlug },
        },
      },
    });
    if (existingData) {
      return {
        success: false,
        error: "Data with this title and slug already exists",
        code: "DUPLICATE",
      };
    }

    const newData = await db.testimonials.create({
      data: {
        imageId: imageId ? Number(imageId) : null,
        company,
        rate: rateNumber,
        translations: {
          create: {
            slug: customSlug,
            title: title,
            nameSurname,
            description: description ?? "",
            locale: locale,
          },
        },
      },
    });
    revalidateAll();
    return {
      success: true,
      data: newData,
      code: "SUCCESS",
      message: "Data created successfully",
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

export async function uptadeTestimonials(
  id: string,
  input: UpdateTestimonialsInput
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
    const existingCategory = await db.testimonials.findUnique({
      where: {
        documentId: id,
        isDeleted: false,
      },
      include: {
        translations: true,
      },
    });
    if (!existingCategory) {
      return { success: false, code: "NOT_FOUND", error: "Category not found" };
    }
    const parsedInput = uptadeTestimonialsSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Validation failed",
        errors: formatZodErrors(parsedInput.error),
      };
    }
    const { title, description, locale, nameSurname, company, rate } =
      parsedInput.data;
    const rateNumber = rate;
    if (isNaN(rateNumber) || rateNumber < 1 || rateNumber > 5) {
      return {
        success: false,
        error: "Rate 1 və 5 arasında olmalıdır",
        code: "VALIDATION_ERROR",
      };
    }
    const customSlug = createSlug(title);
    const uptadeData = await db.$transaction(async (prisma) => {
      const updatedData = await prisma.testimonials.update({
        where: { documentId: id },
        data: {
          rate: rateNumber,
          company,
          translations: {
            upsert: {
              where: {
                documentId_locale: {
                  documentId: id,
                  locale,
                },
              },
              create: {
                title: title,
                nameSurname,
                description: description ?? "",
                locale,
                slug: customSlug || existingCategory.translations?.[0]?.slug,
              },
              update: {
                nameSurname,
                title,
                description,
                slug: customSlug || existingCategory.translations?.[0]?.slug,
              },
            },
          },
        },
        include: {
          translations: { where: { locale: locale } },
        },
      });

      return updatedData;
    });
    revalidateAll();
    return { success: true, data: uptadeData, code: "Success" };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      success: false,
      error: `Internal Server Error - ${errorMessage}`,
      code: "SERVER_ERROR",
    };
  }
}

export async function uptadeTestimonialsImage(
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
    const existingData = await db.testimonials.findUnique({
      where: { documentId: id, isDeleted: false },
    });
    if (!existingData) {
      return { error: "Category not found", code: "NOT_FOUND", success: false };
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
    const uptadeData = await db.testimonials.update({
      where: { documentId: id },
      data: {
        imageId: Number(imageId),
      },
    });
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      data: uptadeData,
      message: "Uptade is successfully",
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
