"use server";

import { db } from "@/src/lib/admin/prismaClient";
import { Role } from "@/src/generated/prisma";
import { checkAuthServerAction } from "@/src/middleware/checkAuthorization";

// ════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════
type Translation = {
  id: number;
  documentId?: string;
  title?: string;
  countryName?: string;
  city?: string;
  address?: string;
  locale: string;
  updatedAt?: Date;
};

type DeletedItem = {
  documentId: string;
  translations: Translation[];
  model: string;
  title?: string;
  branchId?: string;
  isoCode?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  isDeleted?: boolean;
};

type GetDeletedItemsResult = {
  success: boolean;
  code: string;
  data?: DeletedItem[];
  error?: string;
};

// ════════════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════════════

// Models with standard 'title' field in translations
const STANDARD_MODELS: { [key: string]: any } = {
  categories: db.categories,
  "contact-enum": db.contactEnum,
  youtube: db.youtube,
  position: db.position,
  employee: db.employee,
  slider: db.slider,
  advantages: db.advantages,
  blog: db.blog,
  certificates: db.certificates,
  faq: db.faq,
  partners: db.partners,
  sectionContent: db.sectionContent,
  sectioncta: db.sectionCta,
  service: db.services,
  statistics: db.statistics,
  testimonials: db.testimonials,
  photoGallery: db.photoGallery,
  "work-process": db.workProcess,
};

// Special models with different translation field structures
const SPECIAL_MODELS: { [key: string]: any } = {
  branch: db.branch,
  offices: db.office,
};

const MODEL_MAP = { ...STANDARD_MODELS, ...SPECIAL_MODELS };

// ════════════════════════════════════════════════════════════════
// QUERY CONFIGS FOR DIFFERENT MODEL TYPES
// ════════════════════════════════════════════════════════════════

function getQueryConfig(
  modelName: string,
  searchTerm: string | undefined,
  locale: string,
  isDeleted?: boolean
) {
  // Branch model - uses 'countryName' instead of 'title'
  if (modelName === "branch") {
    return {
      where: {
        ...(isDeleted !== undefined && { isDeleted }),
        translations: {
          some: {
            locale,
            ...(searchTerm && {
              countryName: {
                contains: searchTerm,
                mode: "insensitive" as const,
              },
            }),
          },
        },
      },
      select: {
        documentId: true,
        isoCode: true,
        status: true,
        ...(isDeleted === undefined && { isDeleted: true }),
        translations: {
          select: {
            id: true,
            countryName: true,
            locale: true,
            updatedAt: true,
          },
          where: {
            locale,
          },
        },
      },
    };
  }

  // Office model - uses 'city' and 'address' instead of 'title'
  if (modelName === "offices") {
    return {
      where: {
        ...(isDeleted !== undefined && { isDeleted }),
        translations: {
          some: {
            locale,
            ...(searchTerm && {
              OR: [
                {
                  city: { contains: searchTerm, mode: "insensitive" as const },
                },
                {
                  address: {
                    contains: searchTerm,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }),
          },
        },
      },
      select: {
        documentId: true,
        branchId: true,
        latitude: true,
        longitude: true,
        ...(isDeleted === undefined && { isDeleted: true }),
        translations: {
          select: {
            id: true,
            documentId: true,
            city: true,
            address: true,
            locale: true,
            updatedAt: true,
          },
          where: {
            locale,
          },
        },
      },
    };
  }

  // Standard models - use 'title'
  return {
    where: {
      ...(isDeleted !== undefined && { isDeleted }),
      translations: {
        some: {
          locale,
          ...(searchTerm && {
            title: { contains: searchTerm, mode: "insensitive" as const },
          }),
        },
      },
    },
    select: {
      documentId: true,
      ...(isDeleted === undefined && { isDeleted: true }),
      translations: {
        select: {
          id: true,
          documentId: true,
          title: true,
          locale: true,
          updatedAt: true,
        },
        where: {
          locale,
        },
      },
    },
  };
}

// ════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════

function normalizeItem(item: any, modelName: string): DeletedItem {
  // Branch - countryName as title
  if (modelName === "branch") {
    return {
      ...item,
      model: modelName,
      title: item?.translations?.[0]?.countryName || "Ölkə adı yoxdur",
    };
  }

  // Office - city as title, with address as additional info
  if (modelName === "offices") {
    const city = item?.translations?.[0]?.city || "Şəhər adı yoxdur";
    const address = item?.translations?.[0]?.address;
    const title = address ? `${city} - ${address}` : city;

    return {
      ...item,
      model: modelName,
      title,
    };
  }

  // Standard models - title
  return {
    ...item,
    model: modelName,
    title: item?.translations?.[0]?.title || "Başlıq yoxdur",
  };
}

/**
 * Model name-dən Prisma model delegate-i əldə et
 */
function getPrismaModel(modelLabel: string) {
  return MODEL_MAP[modelLabel];
}

/**
 * Bütün model adlarını qaytarır
 */
export async function getAvailableModels(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    return {
      success: true,
      data: Object.keys(MODEL_MAP),
    };
  } catch (error) {
    return {
      success: false,
      error: `Model siyahısı əldə edilə bilmədi -${error}`,
    };
  }
}

// ════════════════════════════════════════════════════════════════
// MAIN ACTIONS
// ════════════════════════════════════════════════════════════════

/**
 * Silinmiş elementləri əldə et (isDeleted: true)
 */
export async function getDeletedItems(
  searchTerm?: string,
  locale: string = "az"
): Promise<GetDeletedItemsResult> {
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
    // Bütün modellərdən silinmiş elementləri əldə et
    const results = await Promise.all(
      Object.keys(MODEL_MAP).map(async (modelLabel) => {
        try {
          const prismaModel = MODEL_MAP[modelLabel];
          const queryConfig = getQueryConfig(
            modelLabel,
            searchTerm,
            locale,
            true
          );
          const items = await prismaModel.findMany(queryConfig);

          return items.map((item: any) => normalizeItem(item, modelLabel));
        } catch (error) {
          console.error(`Error fetching from ${modelLabel}:`, error);
          return [];
        }
      })
    );

    // Flatten və sort
    const allDeletedItems: DeletedItem[] = results
      .flat()
      .sort((a: DeletedItem, b: DeletedItem) => {
        const titleA = a.title ?? "";
        const titleB = b.title ?? "";
        return titleA.localeCompare(titleB);
      });

    return {
      success: true,
      code: "SUCCESS",
      data: allDeletedItems,
    };
  } catch (error) {
    console.error("Error fetching deleted items:", error);
    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Silinmiş elementlər əldə edilərkən xəta baş verdi",
    };
  }
}

/**
 * Müəyyən model üçün silinmiş elementləri əldə et
 */
export async function getDeletedItemsByModel(
  model: string,
  searchTerm?: string,
  locale: string = "az"
): Promise<GetDeletedItemsResult> {
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

  const prismaModel = getPrismaModel(model);

  if (!prismaModel) {
    return {
      success: false,
      code: "INVALID_MODEL",
      error: "Model tapılmadı",
    };
  }

  try {
    const queryConfig = getQueryConfig(model, searchTerm, locale, true);
    const items = await prismaModel.findMany(queryConfig);

    const deletedItems: DeletedItem[] = items.map((item: any) =>
      normalizeItem(item, model)
    );

    return {
      success: true,
      code: "SUCCESS",
      data: deletedItems,
    };
  } catch (error) {
    console.error(`Error fetching deleted items for ${model}:`, error);
    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Silinmiş elementlər əldə edilərkən xəta baş verdi",
    };
  }
}

/**
 * Aktiv (silinməmiş) elementləri əldə et
 */
export async function getActiveItems(
  searchTerm?: string,
  locale: string = "az"
): Promise<GetDeletedItemsResult> {
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
    const results = await Promise.all(
      Object.keys(MODEL_MAP).map(async (modelLabel) => {
        try {
          const prismaModel = MODEL_MAP[modelLabel];
          const queryConfig = getQueryConfig(
            modelLabel,
            searchTerm,
            locale,
            false
          );
          const items = await prismaModel.findMany(queryConfig);

          return items.map((item: any) => normalizeItem(item, modelLabel));
        } catch (error) {
          console.error(`Error fetching from ${modelLabel}:`, error);
          return [];
        }
      })
    );

    const allActiveItems: DeletedItem[] = results
      .flat()
      .sort((a: DeletedItem, b: DeletedItem) => {
        const titleA = a.title ?? "";
        const titleB = b.title ?? "";
        return titleA.localeCompare(titleB);
      });

    return {
      success: true,
      code: "SUCCESS",
      data: allActiveItems,
    };
  } catch (error) {
    console.error("Error fetching active items:", error);
    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Aktiv elementlər əldə edilərkən xəta baş verdi",
    };
  }
}

/**
 * Bütün elementləri əldə et (həm silinmiş, həm də aktiv)
 */
export async function getAllItems(
  searchTerm?: string,
  locale: string = "az"
): Promise<GetDeletedItemsResult> {
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
    const results = await Promise.all(
      Object.keys(MODEL_MAP).map(async (modelLabel) => {
        try {
          const prismaModel = MODEL_MAP[modelLabel];
          const queryConfig = getQueryConfig(
            modelLabel,
            searchTerm,
            locale,
            undefined
          );
          const items = await prismaModel.findMany(queryConfig);

          return items.map((item: any) => normalizeItem(item, modelLabel));
        } catch (error) {
          console.error(`Error fetching from ${modelLabel}:`, error);
          return [];
        }
      })
    );

    const allItems: DeletedItem[] = results
      .flat()
      .sort((a: DeletedItem, b: DeletedItem) => {
        const titleA = a.title ?? "";
        const titleB = b.title ?? "";
        return titleA.localeCompare(titleB);
      });

    return {
      success: true,
      code: "SUCCESS",
      data: allItems,
    };
  } catch (error) {
    console.error("Error fetching all items:", error);
    return {
      success: false,
      code: "SERVER_ERROR",
      error: "Elementlər əldə edilərkən xəta baş verdi",
    };
  }
}
