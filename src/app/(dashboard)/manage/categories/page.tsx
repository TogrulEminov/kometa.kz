"use client";
import React, { Suspense } from "react";
import { usePaginationQuery } from "@/src/hooks/usePaginationQuery";
import { Pagination } from "antd";
import WhiteBlockTitleArea from "../_components/whiteBlockTitle";
import SearchingArea from "../_components/whiteBlockSearch";
import TableTypesArea from "../_components/table";
import { CategoryItem, Column, CustomLocales } from "@/src/services/interface";
import {
  createCreatedAtColumn,
  createImageColumn,
  createImageTitleColumn,
  createSlugColumn,
  createStatusColumn,
  createUpdatedAtColumn,
} from "@/src/utils/tableColumns";
import { useSession } from "next-auth/react";
import { Spin } from "antd";
import { getCategories } from "@/src/actions/client/category.actions";
import { useServerQuery } from "@/src/hooks/useServerActions";

export default function AdminCategoriesPage() {
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    "categories",
    getCategories,
    {
      params: {
        page: queryParams.page,
        pageSize: queryParams.pageSize,
        query: queryParams.title,
        locale: locale as CustomLocales,
      },
    }
  );
  const { data: session } = useSession();
  const isSuperAdmin = session?.user.role !== "SUPER_ADMIN";

  const totalCount = Number(data?.paginations?.dataCount) || 0;
  const page = Number(data?.paginations?.page) || 1;
  const pageSize = Number(data?.paginations?.pageSize) || 12;
  const totalPages = Number(data?.paginations?.totalPages) || 1;

  const columns: Column<CategoryItem>[] = [
    createImageTitleColumn<CategoryItem>(),
    createStatusColumn<any>(),
    createSlugColumn<CategoryItem>(),
    createCreatedAtColumn<CategoryItem>(),
    createUpdatedAtColumn<CategoryItem>(),
    createImageColumn<CategoryItem>({
      page: "categories",
    }) as Column<CategoryItem>,
  ];

  return (
    <div>
      <WhiteBlockTitleArea
        title="Əsas səhifələr"
        disabled={Boolean(isSuperAdmin)}
        link="/manage/categories/create?locale=az"
      />
      <SearchingArea link="manage/categories" />
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "50px",
            }}
          >
            <Spin size="large" />
          </div>
        }
      >
        <TableTypesArea<CategoryItem>
          columns={columns}
          page="categories"
          model="categories"
          dataItems={(data?.data as unknown as CategoryItem[]) || []}
          isError={isError}
          refetch={refetch}
          locale={locale}
          invalidateQueryKey="categories"
          isLoading={isLoading}
        />
      </Suspense>

      {totalPages > 1 && (
        <div style={{ marginTop: "40px" }}>
          <Pagination
            current={page}
            total={totalCount}
            pageSize={pageSize}
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
}
