// app/(dashboard)/manage/offices/[branchId]/_components/OfficeCard.tsx
"use client";
import React, { useState } from "react";
import { Card, Button, Popconfirm, Tag, Space, Spin } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { useServerQuery } from "@/src/hooks/useServerActions";
import {
  deleteOffice,
  getOfficeById,
} from "@/src/actions/client/branches.action";
import { CustomLocales, TypeStatus } from "@/src/services/interface";

interface Office {
  id: number;
  documentId: string;
  latitude: number | null;
  longitude: number | null;
  type: TypeStatus;
  translations: {
    id: number;
    city: string;
    address: string | null;
    locale: string;
  }[];
}

interface Props {
  initialOffice: Office;
  onEdit: () => void;
  onRefetch: () => void;
}

const LOCALES = [
  { key: "az", label: "AZ", color: "blue" },
  { key: "en", label: "EN", color: "green" },
  { key: "ru", label: "RU", color: "orange" },
] as const;

export default function OfficeCard({
  initialOffice,
  onEdit,
  onRefetch,
}: Props) {
  const [selectedLocale, setSelectedLocale] = useState<CustomLocales>("az");
  const [isDeleting, setIsDeleting] = useState(false);
  const { success, error } = useMessageStore();

  const shouldFetch = selectedLocale !== "az";

  const { data: officeData, isLoading } = useServerQuery(
    `office-card-${initialOffice.documentId}-${selectedLocale}`,
    () => getOfficeById(initialOffice.documentId, selectedLocale),
    {
      params: {},
      enabled: shouldFetch,
    }
  );

  const office = selectedLocale === "az" ? initialOffice : officeData?.data;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteOffice(initialOffice.documentId);

      if (result.success) {
        success("Office uğurla silindi!");
        onRefetch();
      } else {
        error(result.error || "Office silinərkən xəta baş verdi.");
      }
    } catch (err: unknown) {
      console.log("err", err);
      error("Gözlənilməz xəta baş verdi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const translation = office?.translations?.find(
    (t: any) => t.locale === selectedLocale
  );

  return (
    <Card
      className="hover:shadow-xl transition-all duration-200"
      actions={[
        <Button
          key="edit"
          type="text"
          icon={<EditOutlined />}
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-700"
        >
          Redaktə et
        </Button>,
        <Popconfirm
          key="delete"
          title="Əminsiniz?"
          description="Bu əməliyyat geri qaytarıla bilməz."
          onConfirm={handleDelete}
          okText="Bəli"
          cancelText="Xeyr"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={isDeleting}
          >
            Sil
          </Button>
        </Popconfirm>,
      ]}
    >
      <div className="space-y-3">
        {/* Dil seçimi - Üst hissədə */}
        <div className="flex items-center justify-between border-b pb-2">
          <Space size="small">
            {LOCALES.map((loc) => {
              const isActive = selectedLocale === loc.key;

              return (
                <Button
                  key={loc.key}
                  size="small"
                  type={isActive ? "primary" : "default"}
                  onClick={() => setSelectedLocale(loc.key as CustomLocales)}
                  loading={isLoading && isActive}
                >
                  {loc.label}
                </Button>
              );
            })}
          </Space>

          {office?.latitude && office?.longitude && (
            <Tag color="green" icon={<EnvironmentOutlined />}>
              GPS
            </Tag>
          )}
          {office?.type === "office" && (
            <Tag color="blue" icon={<EnvironmentOutlined />}>
              Ofis
            </Tag>
          )}
          {office?.type === "warehouse" && (
            <Tag color="orange" icon={<EnvironmentOutlined />}>
              Ambar
            </Tag>
          )}
        </div>

        {/* Məlumatlar */}
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : translation ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                {translation.city}
              </h3>
            </div>

            {translation.address && (
              <div className="flex items-start gap-2 text-gray-600">
                <EnvironmentOutlined className="mt-1 text-blue-500" />
                <p className="text-sm flex-1">{translation.address}</p>
              </div>
            )}

            {office?.latitude && office?.longitude && (
              <div className="bg-gray-50 rounded p-2 mt-2">
                <p className="text-xs text-gray-500 font-mono">
                  📍 {office.latitude.toFixed(6)}, {office.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-600">
              ⚠️ Bu dildə ({selectedLocale.toUpperCase()}) tərcümə mövcud deyil
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Redaktə edərək tərcümə əlavə edə bilərsiniz
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
