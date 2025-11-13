"use client";
import React, { Suspense } from "react";
import { usePaginationQuery } from "@/src/hooks/usePaginationQuery";
import { Pagination } from "antd";
import WhiteBlockTitleArea from "../_components/whiteBlockTitle";
import SearchingArea from "../_components/whiteBlockSearch";
import TableTypesArea from "../_components/table";
import {
  createCreatedAtColumn,
  createImageColumn,
  createImageTitleColumn,
  createStatusColumn,
  createUpdatedAtColumn,
} from "@/src/utils/tableColumns";
import { Spin } from "antd";
import { useServerQuery } from "@/src/hooks/useServerActions";
import { Column, CustomLocales, Employee } from "@/src/services/interface";
import { getEmployee } from "@/src/actions/client/employe.actions";

export default function EmployeeAdminPage() {
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    "employee",
    getEmployee,
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

  const columns: Column<Employee>[] = [
    createImageTitleColumn<Employee>(),
    createStatusColumn<any>(),
    createCreatedAtColumn<Employee>(),
    createUpdatedAtColumn<Employee>(),
    createImageColumn<Employee>({
      page: "employee",
    }) as Column<Employee>,
  ];

  return (
    <div>
      <WhiteBlockTitleArea
        title="İşçilərimiz"
        link="/manage/employee/create?locale=az"
      />
      <SearchingArea link="manage/employee" />
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
        <TableTypesArea<Employee>
          columns={columns}
          page="employee"
          model="employee"
          dataItems={(data?.data as unknown as Employee[]) || []}
          isError={isError}
          refetch={refetch}
          locale={locale}
          invalidateQueryKey="employee"
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
