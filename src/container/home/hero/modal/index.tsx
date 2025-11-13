"use client";
import { MotionButton } from "@/src/lib/motion/motion";
import React, { useTransition, useMemo } from "react";
import { useToggleStore } from "@/src/lib/zustand/useMultiToggleStore";
import GlobalModal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/src/globalElements/modal";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomUiInput from "@/src/globalElements/form/input";
import CustomPhoneUI from "@/src/globalElements/form/phone";
import CustomUiSelect from "@/src/globalElements/form/custom-select";
import { useLocale } from "next-intl";
import { CustomLocales, FileType } from "@/src/services/interface";
import {
  CreateModalInput,
  heroModalSchema,
} from "@/src/schema/callaction.schema";
import { createPriceOffer } from "@/src/actions/ui/form.actions";
import { useMultiServerQuery } from "@/src/hooks/useServerActions";
import { getService } from "@/src/actions/client/service.actions";
import { getEmployee } from "@/src/actions/client/employe.actions";
import { useDropdownOptions } from "@/src/hooks/useDropdownOptions";
import { getForCards } from "@/src/utils/getFullimageUrl";
import CustomImage from "@/src/globalElements/ImageTag";

type HeroModalFormData = z.infer<typeof heroModalSchema>;

export default function HeroModal() {
  const { close } = useToggleStore();
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = React.useState(false);
  const locale = useLocale();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<HeroModalFormData>({
    resolver: zodResolver(heroModalSchema),
    defaultValues: {
      category: "",
      assignedTo: "",
      fullName: "",
      email: "",
      phone: "",
      typesProduct: "",
      weight: "",
      dimensions: "",
      message: "",
    },
  });

  const selectedTeamMember = watch("assignedTo");

  const onSubmit = async (data: CreateModalInput) => {
    startTransition(async () => {
      try {
        await createPriceOffer(data);
        setSuccessMessage(true);
        reset();
        setTimeout(() => {
          setSuccessMessage(false);
          close("hero-modal");
        }, 3000);
      } catch (error) {
        console.error("Submit error:", error);
      }
    });
  };

  // ✅ Multi query
  const [servicesQuery, employeesQuery] = useMultiServerQuery([
    {
      queryName: "service",
      actionFn: getService,
      config: {
        params: {
          page: 1,
          pageSize: 100,
          locale: locale as CustomLocales,
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    },
    {
      queryName: "employee",
      actionFn: getEmployee,
      config: {
        params: {
          page: 1,
          pageSize: 100,
          locale: locale as CustomLocales,
          emailRespone: true,
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    },
  ]);

  // ✅ Extract data
  const categoryData = servicesQuery?.data?.data;
  const teamsData = employeesQuery?.data?.data;

  // ✅ Loading state
  const isLoading = servicesQuery.isLoading || employeesQuery.isLoading;

  // ✅ Category options
  const categoryOptions = useDropdownOptions(
    categoryData?.flatMap((item) =>
      item.translations.map((tr) => ({
        ...tr,
        value: tr.id, // ✅ ID istifadə edin
        label: tr.title,
      }))
    ) || [],
    "value",
    "label"
  );

  // ✅ Team member options
  const teamMemberOptions = useDropdownOptions(
    teamsData?.flatMap((item) =>
      item.translations.map((tr) => ({
        ...tr,
        value: tr.id, // ✅ Translation ID
        label: tr.title,
      }))
    ) || [],
    "value",
    "label"
  );

  // ✅ Selected member info - useMemo ilə optimize edilmiş
  const selectedMemberInfo = useMemo(() => {
    if (!teamsData || !selectedTeamMember) return null;

    // Translation ID ilə axtarın
    for (const employee of teamsData) {
      const translation = employee.translations.find(
        (tr) => tr.id === Number(selectedTeamMember)
      );

      if (translation) {
        return {
          id: employee.id,
          name: translation.title,
          position: translation.position?.title || "N/A",
          avatar: getForCards(employee.imageUrl as FileType),
          email: employee.email,
        };
      }
    }

    return null;
  }, [selectedTeamMember, teamsData]);

  if (successMessage) {
    return (
      <GlobalModal
        modalKey="hero-modal"
        size="md"
        animation="scale"
        className="bg-white rounded-xl shadow-2xl"
        closeOnOverlayClick={false}
      >
        <ModalBody>
          <div
            className="text-center py-8 space-y-6"
            style={{ backgroundColor: "var(--color-ui-5)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-ui-4), var(--color-ui-11))",
              }}
            >
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3
                className="text-xl lg:text-2xl font-bold mb-3"
                style={{ color: "var(--color-ui-1)" }}
              >
                Tələbiniz Göndərildi!
              </h3>
              <p
                className="text-base lg:text-lg"
                style={{ color: "var(--color-ui-7)" }}
              >
                Seçdiyiniz mütəxəssis tezliklə sizinlə əlaqə saxlayacaq.
              </p>
            </div>
          </div>
        </ModalBody>
      </GlobalModal>
    );
  }

  return (
    <GlobalModal
      modalKey="hero-modal"
      size="xl"
      animation="scale"
      className="bg-white rounded-xl shadow-2xl overflow-hidden"
    >
      <ModalHeader modalKey="hero-modal" className="border-none p-0">
        <div className="text-center py-4 px-5 lg:py-6 lg:px-8">
          <h2 className="text-lg lg:text-2xl font-bold text-ui-1 mb-2">
            Pulsuz Qiymət Təklifi
          </h2>
          <p className="text-ui-7 text-sm lg:text-base">
            Yükləməniz üçün ən yaxşı həll yolunu birlikdə tapaq
          </p>
        </div>
      </ModalHeader>

      <ModalBody className="p-5 lg:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ui-4"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <CustomUiSelect
                    title="Yük Növünü Seçin"
                    placeholder="Nəqliyyat növünü seçin"
                    options={categoryOptions}
                    required
                    error={errors.category?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="assignedTo"
                control={control}
                render={({ field }) => (
                  <div>
                    <CustomUiSelect
                      title="Kimə Müraciət Etmək İstəyirsiniz"
                      placeholder="Mütəxəssis seçin"
                      options={teamMemberOptions}
                      required
                      error={errors.assignedTo?.message}
                      {...field}
                    />
                    {selectedMemberInfo && (
                      <div
                        className="mt-3 p-4 rounded-lg border"
                        style={{
                          backgroundColor: "var(--color-ui-5)",
                          borderColor: "var(--color-ui-9)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <CustomImage
                              src={selectedMemberInfo.avatar}
                              title={selectedMemberInfo.name}
                              width={100}
                              height={100}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                            />
                            <div
                              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                              style={{ backgroundColor: "var(--color-ui-4)" }}
                            ></div>
                          </div>
                          <div className="flex-1">
                            <h4
                              className="font-semibold text-sm"
                              style={{ color: "var(--color-ui-1)" }}
                            >
                              {selectedMemberInfo.name}
                            </h4>
                            <p
                              className="text-sm"
                              style={{ color: "var(--color-ui-7)" }}
                            >
                              {selectedMemberInfo.position}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--color-ui-1)" }}
              >
                Əlaqə Məlumatları
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <CustomUiInput
                      title="Ad, Soyad"
                      placeholder="Adınız və soyadınız"
                      required
                      error={errors.fullName?.message}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <CustomUiInput
                      title="Email"
                      type="email"
                      placeholder="example@domain.com"
                      required
                      error={errors.email?.message}
                      {...field}
                    />
                  )}
                />
              </div>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <CustomPhoneUI
                    title="Telefon"
                    required
                    error={errors.phone?.message}
                    value={field.value}
                    onChange={field.onChange}
                    name="phone"
                  />
                )}
              />
            </div>

            {/* Shipment Details */}
            <div className="space-y-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--color-ui-1)" }}
              >
                Yük Məlumatları
              </h3>
              <Controller
                name="typesProduct"
                control={control}
                render={({ field }) => (
                  <CustomUiInput
                    title="Malın Növü"
                    placeholder="Məsələn: Elektronika, Tekstil, Qida məhsulları"
                    required
                    error={errors.typesProduct?.message}
                    {...field}
                  />
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="weight"
                  control={control}
                  render={({ field }) => (
                    <CustomUiInput
                      title="Çəkisi"
                      placeholder="500 kg"
                      required
                      error={errors.weight?.message}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="dimensions"
                  control={control}
                  render={({ field }) => (
                    <CustomUiInput
                      title="Ölçülər"
                      placeholder="100×50×30 sm"
                      required
                      error={errors.dimensions?.message}
                      {...field}
                    />
                  )}
                />
              </div>
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--color-ui-7)" }}
                    >
                      Əlavə Qeydlər (İstəyə görə)
                    </label>
                    <textarea
                      {...field}
                      rows={3}
                      className="w-full p-3 border focus:ring-ui-4 bg-ui-3 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                      placeholder="Xüsusi tələbləriniz və ya əlavə məlumatlar..."
                    />
                  </div>
                )}
              />
            </div>
          </form>
        )}
      </ModalBody>

      <ModalFooter className="p-5 lg:px-8 lg:py-6 bg-ui-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <MotionButton
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => close("hero-modal")}
            className="flex-1 px-6 py-3 border cursor-pointer border-gray-300 rounded-lg font-medium transition-colors"
            style={{
              color: "var(--color-ui-7)",
              backgroundColor: "var(--color-ui-2)",
              borderColor: "var(--color-ui-9)",
            }}
          >
            Ləğv et
          </MotionButton>
          <MotionButton
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit(onSubmit)}
            disabled={isPending || !isDirty || isLoading}
            className="flex-1 px-6 py-3 cursor-pointer text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isPending
                ? "var(--color-ui-7)"
                : `linear-gradient(135deg, var(--color-ui-4), var(--color-ui-11))`,
            }}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Göndərilir...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Təklif Al
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            )}
          </MotionButton>
        </div>
      </ModalFooter>
    </GlobalModal>
  );
}
