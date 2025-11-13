"use client";
import React, { Suspense } from "react";
import { usePaginationQuery } from "@/src/hooks/usePaginationQuery";
import { Pagination } from "antd";
import WhiteBlockTitleArea from "../_components/whiteBlockTitle";
import SearchingArea from "../_components/whiteBlockSearch";
import TableTypesArea from "../_components/table";
import { Column, CustomLocales, GalleryItem } from "@/src/services/interface";
import {
  createCreatedAtColumn,
  createGalleryColumn,
  createImageColumn,
  createImageTitleColumn,
  createStatusColumn,
  createUpdatedAtColumn,
} from "@/src/utils/tableColumns";
import { Spin } from "antd";
import { useServerQuery } from "@/src/hooks/useServerActions";
import { getGallery } from "@/src/actions/client/gallery.actions";

export default function AdminGalleryPage() {
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    "gallery-admin",
    getGallery,
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

  const columns: Column<GalleryItem>[] = [
    createImageTitleColumn<GalleryItem>(),
    createStatusColumn<any>(),
    createCreatedAtColumn<GalleryItem>(),
    createUpdatedAtColumn<GalleryItem>(),
    createImageColumn<GalleryItem>({
      page: "photo-gallery",
    }) as Column<GalleryItem>,
    createGalleryColumn<GalleryItem>({
      page: "photo-gallery",
    }) as Column<GalleryItem>,
  ];

  return (
    <div>
      <WhiteBlockTitleArea
        title="Qalereya şəkilləri"
        link="/manage/photo-gallery/create?locale=az"
      />
      <SearchingArea link="manage/photo-gallery" />
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
        <TableTypesArea<GalleryItem>
          columns={columns}
          page="photo-gallery"
          model="photoGallery"
          dataItems={(data?.data as unknown as GalleryItem[]) || []}
          isError={isError}
          refetch={refetch}
          locale={locale}
          invalidateQueryKey="gallery-admin"
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
