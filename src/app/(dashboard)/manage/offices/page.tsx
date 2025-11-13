// app/(dashboard)/manage/offices/page.tsx
"use client";
import React from "react";
import { Spin, Empty } from "antd";
import WhiteBlockTitleArea from "../_components/whiteBlockTitle";
import { useServerQuery } from "@/src/hooks/useServerActions";
import Link from "next/link";
import { getBranches } from "@/src/actions/client/branches.action";
import { GlobalOutlined, BankOutlined } from "@ant-design/icons";

interface BranchItem {
  id: number;
  documentId: string;
  isoCode: string;
  status: "ACTIVE" | "PLANNED";
  type: "office" | "wherehouse";
  translations: {
    id: number;
    countryName: string;
    locale: string;
  }[];
  offices: any[];
}

export default function OfficesAdminPage() {
  const { data, isLoading, isError } = useServerQuery(
    "branches-all",
    getBranches,
    {
      params: {
        page: 1,
        pageSize: 100,
        query: "",
        locale: "az",
      },
    }
  );

  const branches = (data?.data as unknown as BranchItem[]) || [];

  return (
    <div>
      <WhiteBlockTitleArea title="Offices by Branch" disabled={true} />

      <div className="bg-white rounded-lg shadow-md p-6">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        ) : isError ? (
          <Empty
            description="Məlumat yüklənərkən xəta baş verdi"
            className="py-12"
          />
        ) : branches.length === 0 ? (
          <Empty description="Heç bir branch tapılmadı" className="py-12" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <Link
                key={branch.documentId}
                href={`/manage/offices/${branch.documentId}`}
                className="group border border-gray-200 rounded-lg p-5 hover:shadow-xl hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GlobalOutlined className="text-blue-500 text-xl" />
                    <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                      {branch.translations?.[0]?.countryName || "N/A"}
                    </h3>
                  </div>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {branch.isoCode}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      branch.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {branch.status}
                  </span>
                  <div className="flex items-center gap-1 text-gray-600">
                    <BankOutlined />
                    <span className="text-sm font-medium">
                      {branch.offices?.length || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
