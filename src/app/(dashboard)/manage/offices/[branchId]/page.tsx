// app/(dashboard)/manage/offices/[branchId]/page.tsx
"use client";
import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Spin, Button, Empty } from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useServerQuery } from "@/src/hooks/useServerActions";
import OfficeCard from "./_components/OfficeCard";
import OfficeCreateModal from "./_components/OfficeCreateModal";
import OfficeUpdateModal from "./_components/OfficeUptadeModal";
import { getOfficesByBranch } from "@/src/actions/client/branches.action";
import { CustomLocales } from "@/src/services/interface";

interface Office {
  id: number;
  documentId: string;
  latitude: number | null;
  longitude: number | null;
  type: "office" | "warehouse"; // Added type property
  branchId: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  translations: {
    id: number;
    documentId: string;
    city: string;
    address: string | null;
    locale: string;
  }[];
}

export default function BranchOfficesPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = (searchParams?.get("locale") ?? "az") as CustomLocales;

  const branchId = Array.isArray(params?.branchId)
    ? params.branchId[0]
    : params?.branchId;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(null);

  // 👇 Default AZ dilində məlumatları al
  const { data, isLoading, refetch, isError } = useServerQuery(
    `offices-${branchId}-${locale}`,
    () => getOfficesByBranch(branchId as string, locale),
    {
      params: {},
      enabled: !!branchId,
    }
  );

  const offices = (data?.data as unknown as Office[]) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            size="large"
          >
            Geri
          </Button>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
          size="large"
          disabled={!branchId}
        >
          Ofis Əlavə Et
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Spin size="large" tip="Yüklənir..." />
          </div>
        ) : isError ? (
          <Empty
            description="Məlumat yüklənərkən xəta baş verdi"
            className="py-12"
          >
            <Button type="primary" onClick={() => refetch()}>
              Yenidən yüklə
            </Button>
          </Empty>
        ) : offices.length === 0 ? (
          <Empty
            description="Heç bir ofis tapılmadı. İlk ofisi əlavə edin!"
            className="py-12"
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              İlk ofisi əlavə et
            </Button>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offices.map((office) => (
              <OfficeCard
                key={office.documentId}
                initialOffice={office} // 👈 Office obyektini göndər
                onEdit={() => setSelectedOfficeId(office.documentId)}
                onRefetch={refetch}
              />
            ))}
          </div>
        )}
      </div>

      <OfficeCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        branchId={branchId as string}
        onSuccess={refetch}
      />

      <OfficeUpdateModal
        isOpen={!!selectedOfficeId}
        officeDocumentId={selectedOfficeId}
        onClose={() => setSelectedOfficeId(null)}
        onSuccess={refetch}
      />
    </div>
  );
}
