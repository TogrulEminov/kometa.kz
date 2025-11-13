// app/(dashboard)/manage/offices/[branchId]/_components/OfficeCreateModal.tsx
"use client";
import React, { useTransition } from "react";
import { Modal } from "antd";
import CustomAdminSelect from "@/src/app/(dashboard)/manage/_components/singleSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import {
  CreateOfficeInput,
  createOfficeSchema,
} from "@/src/schema/bracnhes.schema";
import { createOffice } from "@/src/actions/client/branches.action";
import { CustomLocales } from "@/src/services/interface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  branchId: string;
  onSuccess: () => void;
}

export default function OfficeCreateModal({
  isOpen,
  onClose,
  branchId,
  onSuccess,
}: Props) {
  const searchParams = useSearchParams();
  const locale = (searchParams?.get("locale") ?? "az") as CustomLocales;
  const [isPending, startTransition] = useTransition();
  const { success, error } = useMessageStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateOfficeInput>({
    resolver: zodResolver(createOfficeSchema),
    defaultValues: {
      branchId: branchId,
      city: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      type: "office",
      locale: locale,
    },
  });
  const typeValue = watch("type");
  const onSubmit = async (data: CreateOfficeInput) => {
    startTransition(async () => {
      const result = await createOffice(data);

      if (result.success) {
        success("Office uğurla yaradıldı!");
        reset();
        onClose();
        onSuccess();
      } else {
        error(result.error || "Office yaradılarkən xəta baş verdi.");
      }
    });
  };

  return (
    <Modal
      title="Yeni Ofis Yarat"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isPending}
      width={600}
      okText="Yarat"
      cancelText="Ləğv et"
    >
      <form className="space-y-4 mt-6">
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
      </form>
    </Modal>
  );
}
