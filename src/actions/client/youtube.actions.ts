"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import { Locales, Prisma, Role } from "../../generated/prisma";
import { isUuid } from "../../utils/checkSlug";
import { formatZodErrors } from "../../utils/format-zod-errors";
import { ImgInput, imgSchema } from "@/src/schema/img.schema";
import {
  CreateYoutubeInput,
  createYoutubeSchema,
  UpdateYoutubeInput,
  uptadeYoutubeSchema,
} from "@/src/schema/youtube.schema";
import { createSlug } from "@/src/lib/slugifyHelper";
import {
  formatYoutubeDuration,
  getYouTubeVideoId,
} from "@/src/utils/getYouutbeVideoId";
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
  sort?: string;
};
type GetByIDProps = {
  id: string;
  locale: Locales;
};
export async function getYoutube({
  page,
  pageSize,
  query,
  locale,
  sort = "desc",
}: GetProps) {
  const customPage = Number(page) || Number(1);
  const customPageSize = Number(pageSize) || Number(12);
  const skip = 0;
  const take = Number(customPage) * customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.YoutubeWhereInput = {
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
    db.youtube.findMany({
      where: whereClause,
      select: {
        status: true,
        documentId: true,
        id: true,
        imageUrl: true,
        duration: true,
        url: true,
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
            title: true,
            description: true,
            documentId: true,
          },
        },
      },
      orderBy: { createdAt: (sort as Prisma.SortOrder) ?? "desc" },
      skip: skip,
      take: take,
    }),
    db.youtube.count({ where: whereClause }),
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
export async function getYoutubeById({ locale, id }: GetByIDProps) {
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

    const existingData = await db.youtube.findFirst({
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
export async function createYoutube(
  input: CreateYoutubeInput
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
    const validateData = createYoutubeSchema.safeParse(input);
    if (!validateData?.success) {
      return {
        code: "VALIDATION_ERROR",
        success: false,
        errors: formatZodErrors(validateData.error),
      };
    }
    const { title, description, locale, imageId, url } = validateData.data;
    const custom_slug = createSlug(title);

    const existingData = await db.youtube.findFirst({
      where: {
        isDeleted: false,
        translations: {
          some: { locale: locale, slug: custom_slug },
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

    let videoId;
    let duration;

    if (url) {
      videoId = getYouTubeVideoId(url);
    }
    if (videoId) {
      const apiKey = process.env.CLOUD_GOOGLE_API_KEY;
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();
        const videoData = data.items[0];

        // Duration əldə et
        if (videoData.contentDetails && videoData.contentDetails.duration) {
          const rawDuration = videoData.contentDetails.duration;
          duration = formatYoutubeDuration(rawDuration);
        } else {
          console.warn("Duration tapılmadı!");
        }
      }
    }
    const newData = await db.youtube.create({
      data: {
        imageId: Number(imageId) || null,
        duration: duration ?? "",
        url: url,
        translations: {
          create: {
            slug: custom_slug,
            title: title,
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
export async function uptadeYoutube(
  id: string,
  input: UpdateYoutubeInput
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
    const existingCategory = await db.youtube.findUnique({
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
    const parsedInput = uptadeYoutubeSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Validation failed",
        errors: formatZodErrors(parsedInput.error),
      };
    }
    const { title, description, locale, url } = parsedInput.data;
    const customSlug = createSlug(title);
    let videoId;
    let duration;
    if (url) {
      videoId = getYouTubeVideoId(url);
    }
    if (videoId) {
      const apiKey = process.env.CLOUD_GOOGLE_API_KEY;
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();

        const videoData = data.items[0];

        // Duration əldə et
        if (videoData.contentDetails && videoData.contentDetails.duration) {
          const rawDuration = videoData.contentDetails.duration;
          duration = formatYoutubeDuration(rawDuration);
        } else {
          console.warn("Duration tapılmadı!");
        }
      }
    }

    const uptadeData = await db.$transaction(async (prisma) => {
      const updatedData = await prisma.youtube.update({
        where: { documentId: id },
        data: {
          duration: duration,
          url: url,
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
                slug: customSlug || existingCategory.translations?.[0]?.slug,
              },
              update: {
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
export async function uptadeYoutubeImage(
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
    const existingData = await db.youtube.findUnique({
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
    const uptadeData = await db.youtube.update({
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
