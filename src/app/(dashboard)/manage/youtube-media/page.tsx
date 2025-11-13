"use client";
import React, { Suspense } from "react";
import { usePaginationQuery } from "@/src/hooks/usePaginationQuery";
import { Pagination } from "antd";
import WhiteBlockTitleArea from "../_components/whiteBlockTitle";
import SearchingArea from "../_components/whiteBlockSearch";
import TableTypesArea from "../_components/table";
import { YoutubeItems, Column, CustomLocales } from "@/src/services/interface";
import {
  createCreatedAtColumn,
  createImageColumn,
  createImageTitleColumn,
  createStatusColumn,
  createUpdatedAtColumn,
} from "@/src/utils/tableColumns";
import { Spin } from "antd";
import { useServerQuery } from "@/src/hooks/useServerActions";
import { getYoutube } from "@/src/actions/client/youtube.actions";

export default function AdminYoutubePage() {
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    "youtube",
    getYoutube,
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

  const columns: Column<YoutubeItems>[] = [
    createImageTitleColumn<YoutubeItems>(),
    createStatusColumn<any>(),
    createCreatedAtColumn<YoutubeItems>(),
    createUpdatedAtColumn<YoutubeItems>(),
    createImageColumn<YoutubeItems>({
      page: "youtube-media",
    }) as Column<YoutubeItems>,
  ];

  return (
    <div>
      <WhiteBlockTitleArea
        title="Youtube videolarımız"
        link="/manage/youtube-media/create?locale=az"
      />
      <SearchingArea link="manage/youtube-media" />
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
        <TableTypesArea<YoutubeItems>
          columns={columns}
          page="youtube-media"
          model="youtube"
          dataItems={(data?.data as unknown as YoutubeItems[]) || []}
          isError={isError}
          refetch={refetch}
          locale={locale}
          invalidateQueryKey="youtube"
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
