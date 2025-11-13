// app/(dashboard)/manage/socials/page.tsx
"use client";
import React, { useState } from "react";
import { Spin, Button, Empty, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useServerQuery } from "@/src/hooks/useServerActions";
import SocialCard from "./_components/SocialCard";
import SocialCreateModal from "./_components/SocialCreateModal";
import SocialUpdateModal from "./_components/SocialUpdateModal";
import { getSocials } from "@/src/actions/client/social.actions";
import { Social } from "@/src/services/interface";

export default function SocialsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSocialId, setSelectedSocialId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch, isError } = useServerQuery(
    `socials-${page}-${searchQuery}`,
    () =>
      getSocials({
        page,
        pageSize: 12,
        query: searchQuery,
      }),
    {
      params: {},
    }
  );

  const socials = (data?.data as Social[]) || [];
  const pagination = data?.paginations;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sosial Şəbəkələr</h1>
          <p className="text-gray-600 mt-1">
            Sosial şəbəkə linklərini idarə edin
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
          size="large"
        >
          Yeni Əlavə Et
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Sosial şəbəkə axtar..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="large"
          className="max-w-md"
          allowClear
        />
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
        ) : socials.length === 0 ? (
          <Empty
            description={
              searchQuery
                ? "Heç bir nəticə tapılmadı"
                : "Heç bir sosial şəbəkə tapılmadı. İlk sosial şəbəkəni əlavə edin!"
            }
            className="py-12"
          >
            {!searchQuery && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                İlk sosial şəbəkəni əlavə et
              </Button>
            )}
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {socials.map((social) => (
              <SocialCard
                key={social.documentId}
                social={social}
                onEdit={() => setSelectedSocialId(social.documentId)}
                onRefetch={refetch}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            size="large"
          >
            Əvvəlki
          </Button>
          <span className="text-sm font-medium">
            Səhifə {page} / {pagination.totalPages}
          </span>
          <Button
            disabled={page === pagination.totalPages}
            onClick={() => setPage(page + 1)}
            size="large"
          >
            Növbəti
          </Button>
        </div>
      )}

      <SocialCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
      />

      <SocialUpdateModal
        isOpen={!!selectedSocialId}
        socialDocumentId={selectedSocialId}
        onClose={() => setSelectedSocialId(null)}
        onSuccess={refetch}
      />
    </div>
  );
}
