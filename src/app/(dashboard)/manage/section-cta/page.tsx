"use client";
import React, { Suspense } from "react";
import { usePaginationQuery } from "@/src/hooks/usePaginationQuery";
import { Pagination } from "antd";
import WhiteBlockTitleArea from "../_components/whiteBlockTitle";
import SearchingArea from "../_components/whiteBlockSearch";
import TableTypesArea from "../_components/table";
import {
  createCreatedAtColumn,
  createImageTitleColumn,
  createKeyColumn,
  createStatusColumn,
  createUpdatedAtColumn,
} from "@/src/utils/tableColumns";
import { Spin } from "antd";
import { useServerQuery } from "@/src/hooks/useServerActions";
import {
  Column,
  CustomLocales,
  SectionContent,
} from "@/src/services/interface";
import { getSectionCta } from "@/src/actions/client/sectionCta.actions";

export default function SectionCtaPage() {
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    "section-cta",
    getSectionCta,
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

  const columns: Column<SectionContent>[] = [
    createImageTitleColumn<SectionContent>(),
    createStatusColumn<any>(),
    createKeyColumn<SectionContent>(),
    createCreatedAtColumn<SectionContent>(),
    createUpdatedAtColumn<SectionContent>(),
  ];

  return (
    <div>
      <WhiteBlockTitleArea
        title="Section Cta"
        link="/manage/section-cta/create?locale=az"
      />
      <SearchingArea link="manage/section-cta" />
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
        <TableTypesArea<SectionContent>
          columns={columns}
          page="section-cta"
          model="sectioncta"
          dataItems={(data?.data as unknown as SectionContent[]) || []}
          isError={isError}
          refetch={refetch}
          locale={locale}
          invalidateQueryKey="section-cta"
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
