import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";

export const usePaginationQuery = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL-dən oxu, default dəyərlər ver
  const page = Number(searchParams!.get("page")) || 1;
  const pageSize = Number(searchParams!.get("pageSize")) || 25;
  const locale = searchParams!.get("locale") || "az";
  const title = searchParams!.get("title") || "";
  const sort = searchParams!.get("sort") || "desc";

  // Pagination dəyişəndə URL-i yenilə
  const handleChange = (newPage: number, newPageSize: number) => {
    const params = new URLSearchParams(Array.from(searchParams!.entries()));
    params.set("page", String(newPage));
    params.set("pageSize", String(newPageSize));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const queryParams = useMemo(
    () => ({
      locale,
      page,
      pageSize,
      title,
      sort,
    }),
    [locale, title, sort, page, pageSize]
  );

  return {
    page,
    pageSize,
    locale,
    title,
    queryParams,
    handleChange,
  };
};
