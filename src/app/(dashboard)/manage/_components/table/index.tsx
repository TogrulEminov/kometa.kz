"use client";
import React from "react";
import NoDataComponent from "@/src/app/(dashboard)/manage/_components/noData";
import { Spin } from "antd";
import UptadeButton from "@/src/app/(dashboard)/manage/_components/uptadeButton";
import DeleteButton from "@/src/app/(dashboard)/manage/_components/deleteButton";

interface BaseItem {
  id: number | string;
  documentId: string;
  [key: string]: any;
}

interface Column<T> {
  title: string;
  dataIndex: keyof T | string;
  render?: (value: any, record: T, pageId: string) => React.ReactNode;
}

interface Props<T extends BaseItem> {
  refetch?: () => void;
  dataItems: T[];
  isLoading: boolean;
  isError: boolean;
  columns: Column<T>[];
  page: string;
  locale: string;
  model: string;
  invalidateQueryKey: string;
}

const TableTypesArea = <T extends BaseItem>({
  refetch,
  dataItems,
  isLoading,
  isError,
  page,
  model,
  locale,
  columns,
  invalidateQueryKey,
}: Props<T>) => {
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 font-semibold text-lg mb-2">
          Xəta baş verdi
        </div>
        <p className="text-red-500 text-sm">Veri yüklənərkən problem yarandı</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!dataItems?.length) {
    return <NoDataComponent link={`/manage/${page}/create?locale=${locale}`} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b-2 border-gray-300">
            {columns.map((col, index) => (
              <th
                key={`${String(col.dataIndex)}-${col.title}` || index}
                className="py-3 px-6 text-left text-sm font-bold text-gray-900"
              >
                {col.title}
              </th>
            ))}
            <th className="py-3 px-6 text-center text-sm font-bold text-gray-900">
              Əməliyyatlar
            </th>
          </tr>
        </thead>
        <tbody>
          {dataItems?.map((item, index) => (
            <tr
              key={`${item.id}-${index}`}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {columns.map((col, colIndex) => {
                const value = item[col.dataIndex as keyof T];
                return (
                  <td
                    key={`${item.id}-${col.title}-${colIndex}`}
                    className="py-4 px-6 text-sm text-gray-800"
                  >
                    {col.render ? col.render(value, item, page) : value}
                  </td>
                );
              })}
              <td className="py-4 px-6">
                <div className="flex items-center justify-center gap-2">
                  <UptadeButton
                    documentId={`${item.documentId}/content`}
                    link={`manage/${page}/uptade`}
                  />
                  <DeleteButton
                    action="soft-delete"
                    id={item?.documentId}
                    model={model}
                    refetch={refetch}
                    invalidateQueryKey={`${invalidateQueryKey}/${item?.documentId}`}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableTypesArea;
