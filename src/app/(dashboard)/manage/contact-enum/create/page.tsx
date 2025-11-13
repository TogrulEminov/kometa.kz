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
import {
  CreateContactEnumInput,
  createContactEnumSchema,
} from "@/src/schema/contactEnum.schema";
import { createConactEnum } from "@/src/actions/client/contactEnum.actions";

export default function CreateContactEnumPage() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { success, error } = useMessageStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateContactEnumInput>({
    resolver: zodResolver(createContactEnumSchema),
    defaultValues: {
      title: "",
      locale: locale as CustomLocales,
    },
  });

  const onSubmit = async (data: CreateContactEnumInput) => {
    startTransition(async () => {
      const result = await createConactEnum({
        ...data,
      });

      if (result.success) {
        success("Məlumat uğurla yadda saxlandı!");
        reset();
        router.back();
        router.refresh();
      } else {
        error(result.error || "Məlumat göndərilərkən xəta baş verdi.");
      }
    });
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <h1 className="font-medium text-[#171717] text-3xl mb-8">
          {locale === "az"
            ? "Azərbaycan dilində daxil  et"
            : locale === "en"
            ? "İngilis dilində daxil et"
            : "Rus dilində daxil et"}
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"grid grid-cols-1 gap-5"}
        >
          <div className={"flex flex-col space-y-5"}>
            <FieldBlock>
              <CustomAdminInput
                title="Başlıq"
                placeholder="Başlıq"
                required={true}
                error={errors.title?.message}
                {...register("title")}
              />
            </FieldBlock>
          </div>
          <div className={"flex flex-col space-y-5"}>
            <div className={"grid grid-cols-2 gap-5 max-w-lg"}>
              <NavigateBtn />
              <CreateButton
                isLoading={isPending}
                disabled={!isDirty || isPending}
              />
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
