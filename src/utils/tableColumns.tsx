"use client";
import React from "react";
import dayjs from "dayjs";
import StatusBadge from "@/src/app/(dashboard)/manage/_components/status";
import { BaseItem, Column, FileType } from "../services/interface";
import TableImageTitle from "../app/(dashboard)/manage/_components/table/imageColumns";
import Link from "next/link";
import {
  ImagePlus,
  Calendar,
  Clock,
  Tag,
  Link2,
  Image,
  Images,
} from "lucide-react";
import { getForCards } from "./getFullimageUrl";
import { Status } from "../generated/prisma";

interface Translatable {
  translations: { title: string; id: number; [key: string]: any }[];
}

interface Imageable {
  imageUrl?: FileType | null;
}

// Status Column
export const createStatusColumn = <
  T extends BaseItem & { status: Status }
>(): Column<T> => ({
  title: "Status",
  dataIndex: "status",
  render: (status: Status) => <StatusBadge status={status || "published"} />,
});

// Slug Column - Modern Design
export const createSlugColumn = <
  T extends BaseItem & { slug: string }
>(): Column<T> => ({
  title: "Slug",
  dataIndex: "slug",
  render: (slug) => (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 max-w-fit">
      <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="text-xs font-mono font-medium truncate">{slug}</span>
    </div>
  ),
});

// Key Column - Badge Style
export const createKeyColumn = <
  T extends BaseItem & { key: string }
>(): Column<T> => ({
  title: "Açar söz",
  dataIndex: "key",
  render: (key) => (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 max-w-fit">
      <Tag className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="text-xs font-mono font-semibold">{key}</span>
    </div>
  ),
});

// Image + Title Column
export const createImageTitleColumn = <
  T extends BaseItem & Translatable & Imageable
>(
  title: string = "Başlıq"
): Column<T> => ({
  title: title,
  dataIndex: "translations",
  render: (_, record) => {
    const displayTitle = record.translations?.[0]?.title ?? "Tərcümə yoxdur";

    return (
      <TableImageTitle
        title={displayTitle}
        id={Number(record.id)}
        imageUrl={getForCards(record?.imageUrl as FileType)}
        documentId={record.documentId}
      />
    );
  },
});

// Created At Column - Icon + Date
export const createCreatedAtColumn = <
  T extends BaseItem & { createdAt: string | Date }
>(): Column<T> => ({
  title: "Yaradılma tarixi",
  dataIndex: "createdAt",
  render: (createdAt) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-gray-700">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium">
          {dayjs(createdAt).format("DD.MM.YYYY")}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <Clock className="w-3.5 h-3.5" />
        <span className="text-xs">{dayjs(createdAt).format("HH:mm")}</span>
      </div>
    </div>
  ),
});

// Updated At Column - Icon + Date
export const createUpdatedAtColumn = <
  T extends BaseItem & { updatedAt: string | Date }
>(): Column<T> => ({
  title: "Yeniləmə tarixi",
  dataIndex: "updatedAt",
  render: (updatedAt) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-gray-700">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium">
          {dayjs(updatedAt).format("DD.MM.YYYY")}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <Clock className="w-3.5 h-3.5" />
        <span className="text-xs">{dayjs(updatedAt).format("HH:mm")}</span>
      </div>
    </div>
  ),
});

// Main Image Column - Icon Button
export const createMainImageColumn = <T extends BaseItem>({
  page,
}: {
  page: string;
}) => ({
  title: "Əsas şəkil",
  dataIndex: "action-main-image",
  render: (_: any, record: T) => (
    <Link
      href={`/manage/${page}/uptade/${record.documentId}/image/main`}
      className="flex items-center justify-center w-9 h-9 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer"
      title="Əsas şəkli dəyiş"
    >
      <ImagePlus className="w-4 h-4" />
    </Link>
  ),
});

// Image Column - Icon Button
export const createImageColumn = <T extends BaseItem>({
  page,
}: {
  page: string;
}) => ({
  title: "Şəkil",
  dataIndex: "action-image-url",
  render: (_: any, record: T) => (
    <Link
      href={`/manage/${page}/uptade/${record.documentId}/image`}
      className="flex items-center justify-center w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
      title="Şəkli dəyiş"
    >
      <Image className="w-4 h-4" />
    </Link>
  ),
});
export const createGalleryColumn = <T extends BaseItem>({
  page,
}: {
  page: string;
}) => ({
  title: "Qalereya",
  dataIndex: "action-image-url",
  render: (_: any, record: T) => (
    <Link
      href={`/manage/${page}/uptade/${record.documentId}/gallery`}
      className="flex items-center justify-center w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
      title="Şəkli dəyiş"
    >
      <Images className="w-4 h-4" />
    </Link>
  ),
});
