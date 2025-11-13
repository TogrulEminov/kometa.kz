"use client";
import React, { Suspense } from "react";
import { usePaginationQuery } from "@/src/hooks/usePaginationQuery";
import { Pagination } from "antd";
import WhiteBlockTitleArea from "../_components/whiteBlockTitle";
import SearchingArea from "../_components/whiteBlockSearch";
import TableTypesArea from "../_components/table";
import { Column, CustomLocales, SliderItem } from "@/src/services/interface";
import {
  createCreatedAtColumn,
  createImageColumn,
  createImageTitleColumn,
  createStatusColumn,
  createUpdatedAtColumn,
} from "@/src/utils/tableColumns";
import { Spin } from "antd";
import { useServerQuery } from "@/src/hooks/useServerActions";
import { getSlider } from "@/src/actions/client/slider.actions";

export default function AdminSliderPage() {
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    "slider",
    getSlider,
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

  const columns: Column<SliderItem>[] = [
    createImageTitleColumn<SliderItem>(),
    createStatusColumn<any>(),
    createCreatedAtColumn<SliderItem>(),
    createUpdatedAtColumn<SliderItem>(),
    createImageColumn<SliderItem>({
      page: "slider",
    }) as Column<SliderItem>,
  ];

  return (
    <div>
      <WhiteBlockTitleArea
        title="Slayderlər"
        link="/manage/slider/create?locale=az"
      />
      <SearchingArea link="manage/slider" />
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
        <TableTypesArea<SliderItem>
          columns={columns}
          page="slider"
          model="slider"
          dataItems={(data?.data as unknown as SliderItem[]) || []}
          isError={isError}
          refetch={refetch}
          locale={locale}
          invalidateQueryKey="slider"
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
