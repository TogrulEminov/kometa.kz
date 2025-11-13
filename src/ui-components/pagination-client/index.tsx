"use client";
import React from "react";
import dynamic from "next/dynamic";
const GlobalPagination = dynamic(
  () => import("@/src/globalElements/pagination"),
  {
    ssr: false,
  }
);
import { PaginationItem } from "@/src/services/interface";
interface Props {
  paginations: PaginationItem;
}
export default function PaginationContainer({ paginations }: Props) {
  if (paginations?.page <= paginations?.totalPages) return null;
  return (
    <div className="py-10 flex items-center justify-center">
      <GlobalPagination total={paginations?.totalPages} />
    </div>
  );
}
