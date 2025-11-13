// app/(dashboard)/manage/branches/page.tsx
"use client";
import React, { Suspense } from "react";
import { usePaginationQuery } from "@/src/hooks/usePaginationQuery";
import { Pagination, Spin } from "antd";
import WhiteBlockTitleArea from "../_components/whiteBlockTitle";
import SearchingArea from "../_components/whiteBlockSearch";
import TableTypesArea from "../_components/table";
import {
  createCreatedAtColumn,
  createUpdatedAtColumn,
} from "@/src/utils/tableColumns";
import { useServerQuery } from "@/src/hooks/useServerActions";
import { Column, CustomLocales } from "@/src/services/interface";
import { getBranches } from "@/src/actions/client/branches.action";

interface BranchItem {
  id: number;
  documentId: string;
  isoCode: string;
  type: "office" | "wherehouse";
  status: "ACTIVE" | "PLANNED";
  createdAt: Date;
  updatedAt: Date;
  translations: {
    id: number;
    countryName: string;
    locale: string;
  }[];
  offices: any[];
}

export default function BranchesAdminPage() {
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    "branches",
    getBranches,
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

  const columns: Column<BranchItem>[] = [
    {
      title: "Country",
      dataIndex: "translations",
      render: (translations: BranchItem["translations"]) => (
        <span className="font-medium">
          {translations?.[0]?.countryName || "-"}
        </span>
      ),
    },
    {
      title: "ISO Code",
      dataIndex: "isoCode",
      render: (text: string) => (
        <span className="font-semibold text-blue-600">{text}</span>
      ),
    },

    {
      title: "Offices",
      dataIndex: "offices",
      render: (offices: BranchItem["offices"]) => (
        <span className="text-gray-600">{offices?.length || 0}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: BranchItem["status"]) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Növ",
      dataIndex: "type",
      render: (type: BranchItem["type"]) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            type === "wherehouse"
              ? "bg-amber-100 text-amber-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {type === "wherehouse" ? "Ambar" : "Ofis"}
        </span>
      ),
    },
    createCreatedAtColumn<BranchItem>(),
    createUpdatedAtColumn<BranchItem>(),
  ];

  return (
    <div>
      <WhiteBlockTitleArea
        title="Filiallar"
        link="/manage/branches/create?locale=az"
      />
      <SearchingArea link="manage/branches" />
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
        <TableTypesArea<BranchItem>
          columns={columns}
          page="branches"
          model="branch"
          dataItems={(data?.data as unknown as BranchItem[]) || []}
          isError={isError}
          refetch={refetch}
          locale={locale}
          invalidateQueryKey="branches"
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
