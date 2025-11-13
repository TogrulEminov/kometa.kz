// app/(dashboard)/manage/branches/[id]/page.tsx
"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import { CustomLocales } from "@/src/services/interface";
import { useServerQueryById } from "@/src/hooks/useServerActions";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  getBranchById,
  updateBranch,
} from "@/src/actions/client/branches.action";
import {
  UpdateBranchInput,
  updateBranchSchema,
} from "@/src/schema/bracnhes.schema";
import CustomAdminSelect from "../../../../_components/singleSelect";
import dataJson from "@/src/json/main/countries.json";

interface BranchData {
  id: number;
  documentId: string;
  isoCode: string;
  status: "ACTIVE" | "PLANNED";

  translations: {
    id: number;
    countryName: string;
    locale: string;
  }[];
}

export default function BranchUpdatePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { success, error } = useMessageStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";

  const getDataWrapper = async () => {
    const result = await getBranchById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result.data as BranchData | undefined,
      message: result.message,
      code: result.code,
    };
  };

  const { data: existingData } = useServerQueryById<BranchData>(
    `branch`,
    getDataWrapper,
    id,
    { locale }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<UpdateBranchInput>({
    resolver: zodResolver(updateBranchSchema),
    values: {
      countryName: existingData?.translations?.[0]?.countryName || "",
      status: existingData?.status || "ACTIVE",
      locale: locale as CustomLocales,
    },
  });

  const statusValue = watch("status");

  const onSubmit = async (data: UpdateBranchInput) => {
    startTransition(async () => {
      const result = await updateBranch(id as string, {
        ...data,
      });

      if (result.success) {
        success("Branch uğurla yeniləndi!");
        router.back();
        router.refresh();
      } else {
        error(result.error || "Branch yenilənərkən xəta baş verdi.");
      }
    });
  };

  // ISO Code üçün label tapırıq
  const currentCountryLabel =
    dataJson.find((country) => country.value === existingData?.isoCode)
      ?.label || existingData?.isoCode;

  return (
    <section className="flex flex-col gap-4 mb-2">
      <h1 className="text-2xl font-medium text-[#171717] mb-8">
        {locale === "az"
          ? "Azərbaycan dilində daxil et"
          : locale === "en"
          ? "İngilis dilində daxil et"
          : "Rus dilində daxil et"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex flex-col space-y-4">
          <FieldBlock>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISO Code
              </label>
              <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600">
                {existingData?.isoCode || "-"} - {currentCountryLabel}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                ISO kod dəyişdirilə bilməz
              </p>
            </div>
            <CustomAdminInput
              title="Ölkə adı"
              placeholder="Ölkə adı daxil edin"
              required={true}
              error={errors.countryName?.message}
              {...register("countryName")}
            />
            <CustomAdminSelect
              title="Status"
              placeholder="Status seçin"
              value={statusValue}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setValue("status", e.target.value as "ACTIVE" | "PLANNED", {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "PLANNED", label: "Planned" },
              ]}
              error={errors.status?.message}
              required={true}
            />
          </FieldBlock>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <NavigateBtn />
            <SubmitAdminButton
              title={existingData?.translations?.[0]?.countryName}
              isLoading={isPending}
              disabled={!isDirty || isPending}
            />
          </div>
        </div>
      </form>
    </section>
  );
}
