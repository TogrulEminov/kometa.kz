"use client";
import { useRouter, useSearchParams } from "next/navigation";
import CustomAdminEditor from "@/src/app/(dashboard)/manage/_components/CreateEditor";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import SubmitAdminButton from "@/src/app/(dashboard)/manage/_components/submitBtn";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import NavigateBtn from "@/src/app/(dashboard)/manage/_components/navigateBtn";
import {
  About,
  CountGenericType,
  CustomLocales,
  InfoGenericType,
} from "@/src/services/interface";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useMessageStore } from "@/src/hooks/useMessageStore";

import { UpsertAboutInput, upsertAboutSchema } from "@/src/schema/about.schema";
import { upsertAbout } from "@/src/actions/client/about.actions";
import { parseJSON } from "@/src/utils/checkSlug";

interface Props {
  existingData: About | undefined;
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
    reset,
    control,
  } = useForm<UpsertAboutInput>({
    resolver: zodResolver(upsertAboutSchema),
    mode: "onChange",
    values: {
      title: existingData?.translations?.[0]?.title || "",
      badge: existingData?.translations?.[0]?.badge || "",
      subtitle: existingData?.translations?.[0]?.subtitle || "",
      description: existingData?.translations?.[0]?.description || "",
      locale: locale as CustomLocales,
      features: parseJSON<InfoGenericType>(
        existingData?.translations?.[0]?.features
      ),
      statistics: parseJSON<CountGenericType>(
        existingData?.translations?.[0]?.statistics
      ),
      advantages: parseJSON<InfoGenericType>(
        existingData?.translations?.[0]?.advantages
      ),
    },
  });

  const featuresFieldArray = useFieldArray({
    control,
    name: "features" as any,
  });

  const advantagesFieldArray = useFieldArray({
    control,
    name: "advantages",
  });
  const statisticsFieldArray = useFieldArray({
    control,
    name: "statistics" as any,
  });

  const description = watch("description");

  const onSubmit = handleSubmit(async (data: UpsertAboutInput) => {
    startTransition(async () => {
      const result = await upsertAbout(data);

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
          <FieldBlock>
            <CustomAdminInput
              title="Başlıq"
              placeholder="Başlıq"
              required={true}
              error={errors.title?.message}
              {...register("title")}
            />
            <CustomAdminInput
              title="Nişan"
              placeholder="Nişan"
              required={true}
              error={errors.badge?.message}
              {...register("badge")}
            />

            <CustomAdminInput
              title="Qısa başlıq"
              placeholder="Qısa başlıq"
              required={true}
              error={errors.subtitle?.message}
              {...register("subtitle")}
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
        </div>

        <div className="flex flex-col space-y-4">
          {/* Features Section */}
          <FieldBlock title="Xüsusiyyətlər">
            <div className="space-y-3 max-w-sm">
              {featuresFieldArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <CustomAdminInput
                      placeholder={`Xüsusiyyət ${index + 1}`}
                      error={errors.features?.[index]?.title?.message}
                      {...register(`features.${index}.title` as const)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => featuresFieldArray.remove(index)}
                    className="mt-1 px-3 cursor-pointer py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Sil"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => featuresFieldArray.append({ title: "" })}
                className="w-full px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Xüsusiyyət əlavə et
              </button>
            </div>
          </FieldBlock>
          {/* Statistics Section */}
          <FieldBlock title="Statistika">
            <div className="space-y-4 max-w-2xl">
              {statisticsFieldArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Statistika {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => statisticsFieldArray.remove(index)}
                      className="px-3 py-1.5 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      title="Sil"
                    >
                      Sil
                    </button>
                  </div>

                  <div className="space-y-3">
                    <CustomAdminInput
                      title="Başlıq"
                      placeholder="Statistika başlığı"
                      error={errors.statistics?.[index]?.title?.message}
                      {...register(`statistics.${index}.title` as const)}
                    />
                    <CustomAdminInput
                      title="Statistik göstəricisi"
                      type="text"
                      placeholder="Statistik göstəricisi"
                      error={errors.statistics?.[index]?.count?.message}
                      {...register(`statistics.${index}.count` as const)}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  statisticsFieldArray.append({ title: "", count: "" })
                }
                className="w-full  max-w-sm px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Statistika əlavə et
              </button>
            </div>
          </FieldBlock>
          {/* Advantages Section */}
          <FieldBlock title="Üstünlüklərimiz">
            <div className="space-y-4 max-w-2xl">
              {advantagesFieldArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Üstünlük {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => advantagesFieldArray.remove(index)}
                      className="px-3 py-1.5 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      title="Sil"
                    >
                      Sil
                    </button>
                  </div>

                  <div className="space-y-3">
                    <CustomAdminInput
                      title="Başlıq"
                      placeholder="Üstünlük başlığı"
                      error={errors.advantages?.[index]?.title?.message}
                      {...register(`advantages.${index}.title` as const)}
                    />
                    <label htmlFor="description">
                      <textarea
                        title="Təsvir"
                        id="description"
                        placeholder="Üstünlük təsviri"
                        className={`w-full p-3 bg-white border rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed min-h-20 resize-none ${
                          errors.advantages?.[index]?.description?.message
                            ? "border-red-700"
                            : "border-gray-300"
                        }`}
                        {...register(
                          `advantages.${index}.description` as const
                        )}
                      />
                      {errors.advantages?.[index]?.description?.message && (
                        <p>
                          {errors.advantages?.[index]?.description?.message}
                        </p>
                      )}
                    </label>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  advantagesFieldArray.append({ title: "", description: "" })
                }
                className="w-full px-4 py-2 cursor-pointer max-w-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Üstünlük əlavə et
              </button>
            </div>
          </FieldBlock>

          <div className="grid grid-cols-2 gap-4 mt-auto max-w-lg">
            <NavigateBtn />
            <SubmitAdminButton
              title={existingData?.translations?.[0]?.title}
              isLoading={isPending}
              disabled={!isDirty || isPending}
            />
          </div>
        </div>
      </form>
    </section>
  );
}
