"use server";
import { ZodError } from "zod";
import { db } from "../../lib/admin/prismaClient";
import { Locales, Prisma, Role } from "../../generated/prisma";
import { isUuid } from "../../utils/checkSlug";
import { formatZodErrors } from "../../utils/format-zod-errors";
import {
  CreateBlogInput,
  createBlogSchema,
  UpdateBlogInput,
  updateBlogSchema,
} from "@/src/schema/blog.schema";
import { ImgInput, imgSchema } from "@/src/schema/img.schema";
import { createSlug } from "@/src/lib/slugifyHelper";
import { calculateReadTime } from "@/src/utils/calcualateReadTime";
import { headers } from "next/headers";
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

export async function getBlog({
  page,
  pageSize,
  query,
  locale,
  sort,
}: GetProps) {
  const customPage = Number(page) || 1;
  const customPageSize = Number(pageSize) || 12;
  const skip = (Number(customPage) - 1) * customPageSize;
  const take = customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.BlogWhereInput = {
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
    db.blog.findMany({
      where: whereClause,
      select: {
        status: true,
        documentId: true,
        id: true,
        view: true,
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
          where: { locale: locale },
          select: {
            id: true,
            locale: true,
            slug: true,
            title: true,
            description: true,
            readTime: true,
            tags: true,
            documentId: true,
          },
        },
      },
      orderBy: { createdAt: (sort as Prisma.SortOrder) ?? "desc" },
      skip: skip,
      take: take,
    }),
    db.blog.count({ where: whereClause }),
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

export async function getBlogById({ locale, id }: GetByIDProps) {
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

    const existingData = await db.blog.findFirst({
      where: whereClause,
      select: {
        id: true,
        documentId: true,
        status: true,
        view: true,
        imageUrl: {
          select: {
            id: true,
            publicUrl: true,
            fileKey: true,
          },
        },
        translations: {
          where: { locale },
          select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            readTime: true,
            tags: true,
            locale: true,
            seo: {
              select: {
                metaTitle: true,
                metaDescription: true,
                metaKeywords: true,
                imageUrl: {
                  select: {
                    id: true,
                    publicUrl: true,
                    fileKey: true,
                  },
                },
              },
            },
          },
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
    try {
      const headersList = await headers();
      const ipAddress =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headersList.get("x-real-ip") ||
        "unknown";

      // Mövcud baxışın olub-olmadığını yoxla
      const existingView = await db.blogView.findUnique({
        where: {
          blogId_ipAddress: {
            blogId: existingData.id,
            ipAddress: ipAddress,
          },
        },
      });

      // Əgər bu IP-dən əvvəl baxılmayıbsa
      if (!existingView) {
        // Yeni view yarat
        await db.blogView.create({
          data: {
            blogId: existingData.id,
            ipAddress: ipAddress,
          },
        });

        // Blog view sayını artır
        await db.blog.update({
          where: { id: existingData.id },
          data: {
            view: {
              increment: 1,
            },
          },
        });

        // Response-da yeni view count göstər
        existingData.view += 1;
      }
    } catch (viewError) {
      console.error("Error tracking blog view:", viewError);
      // View tracking uğursuz olsa belə, blog məlumatını qaytarırıq
    }
    return { data: existingData, success: true };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      message: `Internal Server Error - ${errorMessage}`,
      success: false,
      code: "SERVER_ERROR",
    };
  }
}

export async function createBlog(
  input: CreateBlogInput
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
    const validateData = createBlogSchema.safeParse(input);
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
      metaTitle,
      metaDescription,
      locale,
      metaKeywords,
      imageId,
      tags,
    } = validateData.data;

    const customSlug = createSlug(title);
    const readTime = calculateReadTime(description || "", locale);

    // Check if slug already exists for this locale
    const existingData = await db.blog.findFirst({
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
        error: "Bu başlıq ilə məqalə artıq mövcuddur",
        code: "DUPLICATE",
      };
    }

    // ✅ Use transaction for proper SEO creation
    const newData = await db.$transaction(async (prisma) => {
      // 1. Create SEO first
      const seo = await prisma.seo.create({
        data: {
          metaTitle: metaTitle || title,
          metaDescription: metaDescription || description || "",
          metaKeywords: metaKeywords || "",
          imageId: imageId ? Number(imageId) : null,
          locale: locale,
        },
      });

      // 2. Create Blog with translation connected to SEO
      const blog = await prisma.blog.create({
        data: {
          imageId: imageId ? Number(imageId) : null,
          translations: {
            create: {
              title: title,
              slug: customSlug,
              description: description || "",
              readTime: readTime,
              tags: JSON.stringify(tags),
              locale: locale,
              seoId: seo.id, // ✅ Connect to SEO
            },
          },
        },
        include: {
          translations: {
            where: { locale },
            include: { seo: true },
          },
        },
      });

      return blog;
    });
    revalidateAll();
    return {
      success: true,
      data: newData,
      code: "SUCCESS",
      message: "Məqalə uğurla yaradıldı",
    };
  } catch (error) {
    console.error("createBlog error:", error);

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

export async function updateBlog(
  id: string,
  input: UpdateBlogInput
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
    const existingData = await db.blog.findUnique({
      where: {
        documentId: id,
        isDeleted: false,
      },
      include: {
        translations: {
          include: {
            seo: true,
          },
        },
      },
    });

    if (!existingData) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Məqalə tapılmadı",
      };
    }

    const parsedInput = updateBlogSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Validation failed",
        errors: formatZodErrors(parsedInput.error),
      };
    }

    const {
      title,
      description,
      metaTitle,
      metaDescription,
      metaKeywords,
      locale,
      tags,
    } = parsedInput.data;

    const customSlug = createSlug(title);
    const readTime = calculateReadTime(description || "", locale);

    const updatedData = await db.$transaction(async (prisma) => {
      // Find existing translation
      const existingTranslation = existingData.translations.find(
        (t) => t.locale === locale
      );

      if (existingTranslation) {
        // ✅ UPDATE: Translation exists
        if (existingTranslation.seoId) {
          // Update existing SEO
          await prisma.seo.update({
            where: { id: existingTranslation.seoId },
            data: {
              metaTitle: metaTitle || title,
              metaDescription: metaDescription || description || "",
              metaKeywords: metaKeywords || "",
            },
          });
        } else {
          // Create new SEO and link it
          const newSeo = await prisma.seo.create({
            data: {
              metaTitle: metaTitle || title,
              metaDescription: metaDescription || description || "",
              metaKeywords: metaKeywords || "",
              locale: locale,
            },
          });

          await prisma.blogTranslations.update({
            where: { id: existingTranslation.id },
            data: {
              seoId: newSeo.id,
            },
          });
        }

        // Update translation
        await prisma.blogTranslations.update({
          where: { id: existingTranslation.id },
          data: {
            title,
            description: description || "",
            slug: customSlug,
            readTime: readTime,
            tags: JSON.stringify(tags),
          },
        });
      } else {
        // ✅ CREATE: Translation doesn't exist
        const newSeo = await prisma.seo.create({
          data: {
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || description || "",
            metaKeywords: metaKeywords || "",
            locale: locale,
          },
        });

        await prisma.blogTranslations.create({
          data: {
            documentId: id,
            title: title,
            description: description || "",
            locale,
            slug: customSlug,
            readTime: readTime,
            tags: JSON.stringify(tags),
            seoId: newSeo.id,
          },
        });
      }

      // Return updated blog
      return await prisma.blog.findUnique({
        where: { documentId: id },
        include: {
          translations: {
            where: { locale: locale },
            include: { seo: true },
          },
        },
      });
    });
    revalidateAll();
    return {
      success: true,
      data: updatedData,
      code: "SUCCESS",
      message: "Məqalə uğurla yeniləndi",
    };
  } catch (error) {
    console.error("updateBlog error:", error);
    const errorMessage = (error as Error).message;
    return {
      success: false,
      error: `Internal Server Error - ${errorMessage}`,
      code: "SERVER_ERROR",
    };
  }
}

export async function updateBlogImage(
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
    const existingData = await db.blog.findUnique({
      where: { documentId: id, isDeleted: false },
    });

    if (!existingData) {
      return {
        error: "Məqalə tapılmadı",
        code: "NOT_FOUND",
        success: false,
      };
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

    const updatedData = await db.blog.update({
      where: { documentId: id },
      data: {
        imageId: Number(imageId),
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

export async function deleteBlog(id: string): Promise<ActionResult> {
  try {
    const existingData = await db.blog.findUnique({
      where: { documentId: id, isDeleted: false },
    });

    if (!existingData) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "Məqalə tapılmadı",
      };
    }

    await db.blog.update({
      where: { documentId: id },
      data: { isDeleted: true },
    });
    revalidateAll();
    return {
      success: true,
      code: "SUCCESS",
      message: "Məqalə uğurla silindi",
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
// Yeni funksiya əlavə et
export async function getBlogNavigation({ id, locale }: GetByIDProps) {
  try {
    const byUuid = isUuid(id);
    const whereClause = byUuid
      ? { isDeleted: false, documentId: id }
      : {
          isDeleted: false,
          translations: { some: { slug: id, locale } },
        };

    const currentBlog = await db.blog.findFirst({
      where: whereClause,
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (!currentBlog) {
      return {
        success: false,
        code: "NOT_FOUND",
        message: "Blog tapılmadı",
      };
    }

    // Previous blog (older)
    const previousBlog = await db.blog.findFirst({
      where: {
        isDeleted: false,
        createdAt: { lt: currentBlog.createdAt },
        translations: { some: { locale } },
      },
      orderBy: { createdAt: "desc" },
      select: {
        documentId: true,
        translations: {
          where: { locale },
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    // Next blog (newer)
    const nextBlog = await db.blog.findFirst({
      where: {
        isDeleted: false,
        createdAt: { gt: currentBlog.createdAt },
        translations: { some: { locale } },
      },
      orderBy: { createdAt: "asc" },
      select: {
        documentId: true,
        translations: {
          where: { locale },
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    return {
      success: true,
      data: {
        previous: previousBlog?.translations?.[0]
          ? {
              title: previousBlog.translations[0].title,
              slug: previousBlog.translations[0].slug,
            }
          : null,
        next: nextBlog?.translations?.[0]
          ? {
              title: nextBlog.translations[0].title,
              slug: nextBlog.translations[0].slug,
            }
          : null,
      },
    };
  } catch (error) {
    console.error("getBlogNavigation error:", error);
    return {
      success: false,
      code: "SERVER_ERROR",
      message: "Xəta baş verdi",
    };
  }
}
