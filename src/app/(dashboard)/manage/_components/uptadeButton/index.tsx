"use client";
import dynamic from "next/dynamic";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import { PenSquare } from "lucide-react";

const Popover = dynamic<any>(() => import("antd").then((mod) => mod.Popover), {
  ssr: false,
});

interface Props {
  link: string;
  documentId: string;
}

const UptadeButton = ({ link, documentId }: Props) => {
  const [editOpen, setEditOpen] = useState<string>("");

  const handleOpenChange = useCallback((documentId: string, open: boolean) => {
    setEditOpen(open ? documentId : "");
  }, []);

  return (
    <Popover
      content={
        <div className="flex flex-col gap-1">
          <Link
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
            href={`/${link}/${documentId}?locale=az`}
          >
            Azərbaycan
          </Link>
          <Link
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
            href={`/${link}/${documentId}?locale=en`}
          >
            English
          </Link>
          <Link
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
            href={`/${link}/${documentId}?locale=ru`}
          >
            Русский
          </Link>
        </div>
      }
      title="Dil seçin"
      trigger="click"
      open={editOpen === documentId}
      onOpenChange={(open: boolean) => handleOpenChange(documentId, open)}
    >
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
      >
        <PenSquare className="w-4 h-4" />
        Redaktə
      </button>
    </Popover>
  );
};

export default React.memo(UptadeButton);
