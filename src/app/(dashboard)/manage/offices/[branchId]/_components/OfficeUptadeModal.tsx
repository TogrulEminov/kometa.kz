// app/(dashboard)/manage/offices/[branchId]/_components/OfficeUpdateModal.tsx
"use client";
import React, { useTransition, useEffect, useState } from "react";
import { Modal, Space, Button, Spin } from "antd";
import { useForm } from "react-hook-form";
import CustomAdminSelect from "@/src/app/(dashboard)/manage/_components/singleSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { useServerQuery } from "@/src/hooks/useServerActions";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import {
  UpdateOfficeInput,
  updateOfficeSchema,
} from "@/src/schema/bracnhes.schema";
import {
  getOfficeById,
  updateOffice,
} from "@/src/actions/client/branches.action";
import { CustomLocales } from "@/src/services/interface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  officeDocumentId: string | null;
  onSuccess: () => void;
}

const LOCALES = [
  { key: "az", label: "AZ", color: "blue" },
  { key: "en", label: "EN", color: "green" },
  { key: "ru", label: "RU", color: "orange" },
] as const;

export default function OfficeUpdateModal({
  isOpen,
  onClose,
  officeDocumentId,
  onSuccess,
}: Props) {
  const [selectedLocale, setSelectedLocale] = useState<CustomLocales>("az");
  const [isPending, startTransition] = useTransition();
  const { success, error } = useMessageStore();

  // 👇 Query key-ə selectedLocale əlavə et
  const { data: officeData, isLoading } = useServerQuery(
    `office-${officeDocumentId}-${selectedLocale}`, // 👈 Locale əlavə olundu
    () => getOfficeById(officeDocumentId as string, selectedLocale),
    {
      params: {},
      enabled: !!officeDocumentId && isOpen,
    }
  );

  const office = officeData?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UpdateOfficeInput>({
    resolver: zodResolver(updateOfficeSchema),
    defaultValues: {
      city: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      locale: "az",
      type: "office",
    },
  });

  // 👇 Data və locale dəyişəndə formu yenilə
  useEffect(() => {
    if (office && isOpen) {
      const translation = office.translations?.find(
        (t: any) => t.locale === selectedLocale
      );

      setValue("city", translation?.city || "");
      setValue("address", translation?.address || "");
      setValue("latitude", office.latitude || undefined);
      setValue("longitude", office.longitude || undefined);
      setValue("locale", selectedLocale);
      setValue("type", office.type || "office");
    }
  }, [office, selectedLocale, isOpen, setValue]);

  // Modal bağlananda reset et
  useEffect(() => {
    if (!isOpen) {
      setSelectedLocale("az");
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: UpdateOfficeInput) => {
    if (!officeDocumentId) return;

    startTransition(async () => {
      const result = await updateOffice(officeDocumentId, data);

      if (result.success) {
        success(
          `Office ${selectedLocale.toUpperCase()} dilində uğurla yeniləndi!`
        );
        reset();
        onClose();
        onSuccess();
      } else {
        error(result.error || "Office yenilənərkən xəta baş verdi.");
      }
    });
  };

  // Seçilmiş dildə tərcümə var mı?
  const currentTranslation = office?.translations?.find(
    (t: any) => t.locale === selectedLocale
  );
  const typeValue = watch("type");

  return (
    <Modal
      title={
        <div className="flex items-center justify-between pr-6">
          <span>Ofisi Yenilə</span>
          <Space size="small">
            {LOCALES.map((loc) => {
              const hasTranslation = office?.translations?.some(
                (t: any) => t.locale === loc.key
              );
              const isActive = selectedLocale === loc.key;

              return (
                <Button
                  key={loc.key}
                  size="small"
                  type={isActive ? "primary" : "default"}
                  onClick={() => setSelectedLocale(loc.key as CustomLocales)}
                  className={!hasTranslation ? "opacity-50" : ""}
                  disabled={isLoading}
                >
                  {loc.label}
                  {!hasTranslation && " ✕"}
                </Button>
              );
            })}
          </Space>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isPending}
      width={600}
      okText="Yenilə"
      cancelText="Ləğv et"
    >
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Spin size="large" tip="Yüklənir..." />
        </div>
      ) : (
        <form className="space-y-4 mt-6">
          {!currentTranslation && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Bu dildə ({selectedLocale.toUpperCase()}) tərcümə yoxdur.
                Yeni tərcümə yaradılacaq.
              </p>
            </div>
          )}

          <FieldBlock>
            <CustomAdminInput
              title="Şəhər"
              placeholder="Şəhər adı daxil edin"
              required={true}
              error={errors.city?.message}
              {...register("city")}
            />
            <CustomAdminSelect
              title="Növ"
              placeholder="Növ seçin"
              value={typeValue}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setValue("type", (e.target.value as "office") || "wherehouse", {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              options={[
                { value: "office", label: "Ofis" },
                { value: "warehouse", label: "Ambar" },
              ]}
              error={errors.type?.message}
              required={true}
            />
            <CustomAdminInput
              title="Ünvan"
              placeholder="Ünvan daxil edin"
              error={errors.address?.message}
              {...register("address")}
            />
            <div className="grid grid-cols-2 gap-4">
              <CustomAdminInput
                title="Latitude (En dairəsi)"
                placeholder="40.4093"
                type="number"
                step="any"
                error={errors.latitude?.message}
                {...register("latitude", { valueAsNumber: true })}
              />
              <CustomAdminInput
                title="Longitude (Uzunluq dairəsi)"
                placeholder="49.8671"
                type="number"
                step="any"
                error={errors.longitude?.message}
                {...register("longitude", { valueAsNumber: true })}
              />
            </div>
          </FieldBlock>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              💡 Hal-hazırda <strong>{selectedLocale.toUpperCase()}</strong>{" "}
              dilində redaktə edirsiniz
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
}
