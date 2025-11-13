// app/(dashboard)/manage/branches/create/page.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import CreateButton from "@/src/app/(dashboard)/manage/_components/createButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomLocales } from "@/src/services/interface";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { useForm } from "react-hook-form";
import CustomAdminSelect from "../../_components/singleSelect";
import {
  CreateBranchInput,
  createBranchSchema,
} from "@/src/schema/bracnhes.schema";
import { createBranch } from "@/src/actions/client/branches.action";
import data from "@/src/json/main/countries.json"; // JSON faylını import edin

export default function CreateBranch() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { success, error } = useMessageStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<CreateBranchInput>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: {
      isoCode: "",
      countryName: "",
      status: "ACTIVE",

      locale: locale as CustomLocales,
    },
  });

  const statusValue = watch("status");

  const isoCodeValue = watch("isoCode");

  const handleIsoCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const selectedCountry = data?.find(
      (country) => country.value === selectedCode
    );

    setValue("isoCode", selectedCode, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Avtomatik ölkə adını doldur
    if (selectedCountry) {
      setValue("countryName", selectedCountry.label, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onSubmit = async (data: CreateBranchInput) => {
    startTransition(async () => {
      const result = await createBranch({
        ...data,
      });

      if (result.success) {
        success("Branch uğurla yaradıldı!");
        reset();
        router.back();
        router.refresh();
      } else {
        error(result.error || "Branch yaradılarkən xəta baş verdi.");
      }
    });
  };

  return (
    <section className="flex flex-col gap-4 mb-5">
      <h1 className="font-medium text-[#171717] text-3xl mb-8">
        {locale === "az"
          ? "Azərbaycan dilində daxil et"
          : locale === "en"
          ? "İngilis dilində daxil et"
          : "Rus dilində daxil et"}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-5"
      >
        <div className="flex flex-col space-y-5">
          <FieldBlock>
            <CustomAdminSelect
              title="ISO Code"
              placeholder="Ölkə seçin"
              value={isoCodeValue}
              onChange={handleIsoCodeChange}
              options={data}
              error={errors.isoCode?.message}
              required={true}
            />
            <CustomAdminInput
              title="Ölkə adı"
              placeholder="Ölkə adı avtomatik doldurulacaq"
              required={true}
              error={errors.countryName?.message}
              {...register("countryName")}
              readOnly
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
        <div className="flex flex-col space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <NavigateBtn />
            <CreateButton
              isLoading={isPending}
              disabled={!isDirty || isPending}
            />
          </div>
        </div>
      </form>
    </section>
  );
}
