import { getApi } from "../apiServices";
interface GetDataProps {
  searchQuery?: URLSearchParams | string;
  slug?: string;
  url?: string;
  cache?: RequestCache;
  revalidate?: number;
}

export const getCustomData = async ({ searchQuery, url }: GetDataProps) => {
  const queryString =
    typeof searchQuery === "string" ? searchQuery : searchQuery?.toString();

  try {
    const endpoint = `/${url}${queryString ? `?${queryString}` : ""}`;
    const data = await getApi({ endpoint });
    return data;
  } catch (error) {
    console.error("Error in getCustomData:", error);
    throw error;
  }
};

export const getCachingCustomData = async ({
  searchQuery,
  url,
  revalidate,
  cache,
}: GetDataProps) => {
  const queryString =
    typeof searchQuery === "string" ? searchQuery : searchQuery?.toString();

  try {
    const endpoint = `/${url}${queryString ? `?${queryString}` : ""}`;
    const data = await getApi({ endpoint, revalidate, cache });
    return data;
  } catch (error) {
    console.error("Error in getCustomData:", error);
    throw error;
  }
};
