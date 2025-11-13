"use client";
import React, { Suspense } from "react";
import { usePaginationQuery } from "@/src/hooks/usePaginationQuery";
import { Pagination } from "antd";
import WhiteBlockTitleArea from "../_components/whiteBlockTitle";
import SearchingArea from "../_components/whiteBlockSearch";
import TableTypesArea from "../_components/table";
import {
  AdvantagesItem,
  Column,
  CustomLocales,
} from "@/src/services/interface";
import {
  createCreatedAtColumn,
  createImageColumn,
  createImageTitleColumn,
  createStatusColumn,
  createUpdatedAtColumn,
} from "@/src/utils/tableColumns";
import { Spin } from "antd";
import { useServerQuery } from "@/src/hooks/useServerActions";
import { getAdvantages } from "@/src/actions/client/advantages.actions";

export default function AdminAdvantagesPage() {
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    "advantages",
    getAdvantages,
    {
      params: {
        page: queryParams.page,
        pageSize: queryParams.pageSize,
        query: queryParams.title,
        locale: locale as CustomLocales,
      },
    }
  );

  const totalCount = Number(data?.paginations?.dataCount) || 0;
  const page = Number(data?.paginations?.page) || 1;
  const pageSize = Number(data?.paginations?.pageSize) || 12;
  const totalPages = Number(data?.paginations?.totalPages) || 1;

  const columns: Column<AdvantagesItem>[] = [
    createImageTitleColumn<AdvantagesItem>(),
    createStatusColumn<any>(),
    createCreatedAtColumn<AdvantagesItem>(),
    createUpdatedAtColumn<AdvantagesItem>(),
    createImageColumn<AdvantagesItem>({
      page: "advantages",
    }) as Column<AdvantagesItem>,
  ];

  return (
    <div>
      <WhiteBlockTitleArea
        title="Üstünlüklərimiz"
        link="/manage/advantages/create?locale=az"
      />
      <SearchingArea link="manage/advantages" />
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
        <TableTypesArea<AdvantagesItem>
          columns={columns}
          page="advantages"
          model="advantages"
          dataItems={(data?.data as unknown as AdvantagesItem[]) || []}
          isError={isError}
          refetch={refetch}
          locale={locale}
          invalidateQueryKey="advantages"
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
