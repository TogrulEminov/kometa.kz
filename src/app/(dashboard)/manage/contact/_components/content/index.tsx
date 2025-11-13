"use client";
import { useRouter, useSearchParams } from "next/navigation";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import { ContactInfo, CustomLocales } from "@/src/services/interface";
import { Controller, useForm } from "react-hook-form";
import CustomAdminEditor from "@/src/app/(dashboard)/manage/_components/CreateEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import DynamicPhoneAdmin from "@/src/app/(dashboard)/manage/_components/create-phone";

import {
  UpsertContactInput,
  upsertContactSchema,
} from "@/src/schema/contact.schema";
import { upsertContact } from "@/src/actions/client/contact.actions";

interface Props {
  existingData: ContactInfo | undefined;
  refetch: () => void;
}

export default function Content({ existingData, refetch }: Props) {
  const searchParams = useSearchParams();
  const { success, error } = useMessageStore();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    control,
    reset,
  } = useForm<UpsertContactInput>({
    resolver: zodResolver(upsertContactSchema),
    mode: "onChange",
    values: {
      phone: existingData?.phone ?? "",
      phoneSecond: existingData?.phoneSecond ?? "",
      adressLink: existingData?.adressLink ?? "",
      email: existingData?.email ?? "",
      latitude: (existingData?.latitude as string | undefined) ?? undefined,
      longitude: (existingData?.longitude as string | undefined) ?? undefined,
      whatsapp: existingData?.whatsapp ?? "",
      tag: existingData?.translations?.[0]?.tag ?? "",
      adress: existingData?.translations?.[0]?.adress ?? "",
      title: existingData?.translations?.[0]?.title ?? "",
      description: existingData?.translations?.[0]?.description ?? "",
      workHours: existingData?.translations?.[0]?.workHours ?? "",
      support: existingData?.translations?.[0]?.support ?? "",
      locale: locale as CustomLocales,
    },
  });
  const description = watch("description");
  const onSubmit = handleSubmit(async (data: UpsertContactInput) => {
    startTransition(async () => {
      const result = await upsertContact(data);

      if (result.success) {
        success("Məlumat uğurla yadda saxlandı!");
        reset();
        router.refresh();
        refetch();
      } else {
        error(result.error || "Məlumat göndərilərkən xəta baş verdi.");
      }
    });
  });

  return (
    <section className="flex flex-col gap-4 mb-2">
      <h1 className="text-2xl font-medium text-[#171717] mb-8">
        {locale === "az"
          ? "Azərbaycan dilində daxil et"
          : locale === "en"
          ? "İngilis dilində daxil et"
          : "Rus dilində daxil et"}
      </h1>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
        <div className="flex flex-col space-y-4">
          <FieldBlock title="Tərcümə ediləcək form məlumatları">
            <CustomAdminInput
              title="Başlıq"
              placeholder="Başlıq"
              required={true}
              error={errors.title?.message}
              {...register("title")}
            />

            <CustomAdminInput
              title="Nişan (Tag)"
              placeholder="Nişan"
              required={false}
              error={errors.tag?.message}
              {...register("tag")}
            />

            <CustomAdminInput
              title="İş saatları"
              placeholder="İş saatlarını daxil edin"
              required={false}
              error={errors.workHours?.message}
              {...register("workHours")}
            />

            <CustomAdminInput
              title="Ünvan"
              placeholder="Ünvanı daxil edin"
              required={true}
              error={errors.adress?.message}
              {...register("adress")}
            />

            <CustomAdminInput
              title="Dəstək məlumatı"
              placeholder="Dəstək məlumatını daxil edin"
              required={false}
              error={errors.support?.message}
              {...register("support")}
            />
            <CustomAdminEditor
              title="Qısa məlumat"
              value={description}
              onChange={(value) =>
                setValue("description", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              error={errors.description?.message}
            />
          </FieldBlock>
          <FieldBlock>
            <CustomAdminInput
              title="Latitude (En dairəsi)"
              placeholder="40.4093"
              type="text"
              step="any"
              error={errors.latitude?.message}
              {...register("latitude")}
            />
            <CustomAdminInput
              title="Longitude (Uzunluq dairəsi)"
              placeholder="49.8671"
              type="text"
              step="any"
              error={errors.longitude?.message}
              {...register("longitude")}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <DynamicPhoneAdmin
                  title="Telefon"
                  placeholder="+994 XX XXX XX XX"
                  required
                  error={errors.phone?.message}
                  value={field.value}
                  onChange={field.onChange}
                  name="phone"
                />
              )}
            />

            <Controller
              name="phoneSecond"
              control={control}
              render={({ field }) => (
                <DynamicPhoneAdmin
                  title="Əlavə telefon"
                  placeholder="+994 XX XXX XX XX"
                  required={false}
                  error={errors.phone?.message}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  name="phoneSecond"
                />
              )}
            />

            <CustomAdminInput
              title="Email"
              placeholder="info@example.com"
              type="email"
              required={true}
              error={errors.email?.message}
              {...register("email")}
            />
            <Controller
              name="whatsapp"
              control={control}
              render={({ field }) => (
                <DynamicPhoneAdmin
                  title="WhatsApp"
                  placeholder="+994 XX XXX XX XX"
                  required
                  error={errors.whatsapp?.message}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  name="whatsapp"
                />
              )}
            />

            <CustomAdminInput
              title="Ünvan linki"
              placeholder="Google Maps linki"
              required={false}
              error={errors.adressLink?.message}
              {...register("adressLink")}
            />
          </FieldBlock>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4 mt-auto max-w-lg">
            <NavigateBtn />
            <SubmitAdminButton
              title={existingData ? "Yenilə" : "Əlavə et"}
              isLoading={isPending}
              disabled={!isDirty || isPending}
            />
          </div>
        </div>
      </form>
    </section>
  );
}
