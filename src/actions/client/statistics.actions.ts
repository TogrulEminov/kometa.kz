"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import { Locales, Prisma, Role } from "../../generated/prisma";
import { isUuid } from "../../utils/checkSlug";
import { formatZodErrors } from "../../utils/format-zod-errors";
import { createSlug } from "@/src/lib/slugifyHelper";
import {
  CreateStatisticsInput,
  createStatisticsSchema,
  UpdateStatisticsInput,
  uptadeStatisticsSchema,
} from "@/src/schema/statistics.schema";
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
  page: number;
  query: string;
  pageSize: number;
  locale: Locales;
};
type GetByIDProps = {
  id: string;
  locale: Locales;
};

export async function getStatisticsData({
  page,
  pageSize,
  query,
  locale,
}: GetProps) {
  const customPageSize = Number(pageSize) || Number(12);
  const skip = 0;
  const take = Number(page) * customPageSize;
  const searchTerm = query?.trim();
  const whereClause: Prisma.StatisticsWhereInput = {
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
    db.statistics.findMany({
      where: whereClause,
      select: {
        status: true,
        documentId: true,
        id: true,
        count: true,
        createdAt: true,
        orderNumber: true,
        updatedAt: true,
        translations: {
          where: {
            locale: locale,
          },
          select: {
            id: true,
            locale: true,
            slug: true,
            title: true,
            documentId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    }),
    db.statistics.count({ where: whereClause }),
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

export async function getStatisticsById({ locale, id }: GetByIDProps) {
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

    const existingData = await db.statistics.findFirst({
      where: whereClause,
      select: {
        orderNumber: true,
        count: true,
        translations: {
          where: { locale },
        },
      },
    });

    if (!existingData) {
      return {
        message: "Data not found",
        code: "NOT_FOUND",
        success: false,
      };
    }
    return { data: existingData };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return { message: `Internal Server Error - ${errorMessage}` };
  }
}

export async function createStatistics(
  input: CreateStatisticsInput
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
    const validateData = createStatisticsSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }
    const { title, description, locale, orderNumber, count } =
      validateData.data;

    const customSlug = createSlug(title);
    const existingData = await db.statistics.findFirst({
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
        error: "Data with this title and key already exists",
        code: "DUPLICATE",
      };
    }

    const newData = await db.statistics.create({
      data: {
        orderNumber,
        count,
        translations: {
          create: {
            title: title,
            slug: customSlug,
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

export async function uptadeStatistics(
  id: string,
  input: UpdateStatisticsInput
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
    const existingData = await db.statistics.findUnique({
      where: {
        documentId: id,
        isDeleted: false,
      },
      include: {
        translations: true,
      },
    });
    if (!existingData) {
      return { success: false, code: "NOT_FOUND", error: "Data not found" };
    }
    const parsedInput = uptadeStatisticsSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Validation failed",
        errors: formatZodErrors(parsedInput.error),
      };
    }
    const { title, description, locale, orderNumber, count } = parsedInput.data;
    const customSlug = createSlug(title);
    const uptadeData = await db.$transaction(async (prisma) => {
      const updatedData = await prisma.statistics.update({
        where: { documentId: id },
        data: {
          orderNumber,
          count,
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
                description: description ?? "",
                locale,
                slug: customSlug || existingData.translations?.[0]?.slug,
              },
              update: {
                title,
                description,
                slug: customSlug || existingData.translations?.[0]?.slug,
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
