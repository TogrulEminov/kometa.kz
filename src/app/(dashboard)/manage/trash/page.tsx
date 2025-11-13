"use client";

import React from "react";
import { usePaginationQuery } from "@/src/hooks/usePaginationQuery";
import TableArea from "./_components/table";
import SearchingArea from "@/src/app/(dashboard)/manage/_components/whiteBlockSearch";
import WhiteBlockTitleArea from "../_components/whiteBlockTitle";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useServerQuery } from "@/src/hooks/useServerActions";
import { getDeletedItems } from "@/src/actions/client/trash.actions";
export default function TrashMainPage() {
  const { queryParams, locale } = usePaginationQuery();
  const { data: user } = useSession();

  // Authorization check
  if (user?.user?.role !== "SUPER_ADMIN") {
    redirect("/manage/dashboard");
  }

  // Fetch deleted items
  const { data, isLoading, isError, refetch } = useServerQuery(
    "trash-items",
    async (params: { searchTerm?: string; locale?: string }) => {
      return await getDeletedItems(params.searchTerm, params.locale);
    },
    {
      params: {
        searchTerm: queryParams.title || "",
        locale: locale || "az",
      },
    }
  );

  return (
    <div>
      <WhiteBlockTitleArea title="Silinənlər" disabled={true} />
      <SearchingArea link="manage/trash" />

      <TableArea
        refetch={refetch}
        dataItems={data?.success ? data.data || [] : []}
        isError={isError || !data?.success}
        isLoading={isLoading}
      />
    </div>
  );
}
