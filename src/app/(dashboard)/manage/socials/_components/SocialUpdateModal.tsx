// app/(dashboard)/manage/socials/_components/SocialUpdateModal.tsx
"use client";
import React, { useTransition, useEffect } from "react";
import { Modal, Select, Spin, Space } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { useServerQuery } from "@/src/hooks/useServerActions";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import {
  UpdateSocialInput,
  updateSocialSchema,
} from "@/src/schema/social.schema";
import {
  getSocialById,
  updateSocial,
} from "@/src/actions/client/social.actions";
import Icons from "@/public/icons";

interface Social {
  id: number;
  documentId: string;
  socialName: string;
  socialLink: string;
  iconName: string;
  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  socialDocumentId: string | null;
  onSuccess: () => void;
}

const availableIcons = [
  { name: "Facebook", label: "Facebook" },
  { name: "Instagram", label: "Instagram" },
  { name: "Twitter", label: "Twitter" },
  { name: "Linkedin", label: "Linkedin" },
  { name: "Youtube", label: "Youtube" },
  { name: "Telegram", label: "Telegram" },
  { name: "Whatsapp", label: "Whatsapp" },
  { name: "Tiktok", label: "Tiktok" },
];

export default function SocialUpdateModal({
  isOpen,
  onClose,
  socialDocumentId,
  onSuccess,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const { success, error } = useMessageStore();

  const { data: socialData, isLoading } = useServerQuery(
    `social-${socialDocumentId}`,
    () => getSocialById({ id: socialDocumentId as string }),
    {
      params: {},
      enabled: !!socialDocumentId && isOpen,
    }
  );

  const social = socialData?.data as Social | undefined;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateSocialInput>({
    resolver: zodResolver(updateSocialSchema),
    defaultValues: {
      socialName: "",
      socialLink: "",
      iconName: "",
      status: "published",
    },
  });

  const selectedIcon = watch("iconName");

  useEffect(() => {
    if (social && isOpen) {
      setValue("socialName", social.socialName || "");
      setValue("socialLink", social.socialLink || "");
      setValue("iconName", social.iconName || "");
      setValue("status", social.status || "published");
    }
  }, [social, isOpen, setValue]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: UpdateSocialInput) => {
    if (!socialDocumentId) return;

    startTransition(async () => {
      const result = await updateSocial(socialDocumentId, data);

      if (result.success) {
        success("Sosial şəbəkə uğurla yeniləndi!");
        reset();
        onClose();
        onSuccess();
      } else {
        error(result.error || "Yenilənərkən xəta baş verdi.");
      }
    });
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const IconPreview = ({ iconName }: { iconName: string }) => {
    if (!iconName) return null;

    const IconComponent = Icons[iconName as keyof typeof Icons];

    if (!IconComponent || typeof IconComponent !== "function") {
      return null;
    }

    return IconComponent({ fill: "currentColor" });
  };

  return (
    <Modal
      title={
        <div className="text-xl font-semibold">Sosial Şəbəkəni Redaktə Et</div>
      }
      open={isOpen}
      onCancel={handleCancel}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isPending}
      width={650}
      okText="Yenilə"
      cancelText="Ləğv et"
      okButtonProps={{
        size: "large",
        className: "h-10",
      }}
      cancelButtonProps={{
        size: "large",
        className: "h-10",
      }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center p-16">
          <Space direction="vertical" align="center" size="large">
            <Spin size="large" />
            <p className="text-gray-500">Yüklənir...</p>
          </Space>
        </div>
      ) : (
        <form className="space-y-5 mt-6">
          <FieldBlock>
            {/* Social Name */}
            <div>
              <CustomAdminInput
                title="Sosial Şəbəkə Adı"
                placeholder="Məsələn: Facebook, Instagram"
                required={true}
                error={errors.socialName?.message}
                {...register("socialName")}
              />
            </div>

            {/* Social Link */}
            <div>
              <CustomAdminInput
                title="Link"
                placeholder="https://facebook.com/yourpage"
                required={true}
                error={errors.socialLink?.message}
                {...register("socialLink")}
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon seçin <span className="text-red-500">*</span>
              </label>
              <Controller
                name="iconName"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Icon seçin"
                    className="w-full"
                    size="large"
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label as string)
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {availableIcons.map((icon) => (
                      <Select.Option
                        key={icon.name}
                        value={icon.name}
                        label={icon.label}
                      >
                        <Space>
                          <div className="w-5 h-5">
                            <IconPreview iconName={icon.name} />
                          </div>
                          <span>{icon.label}</span>
                        </Space>
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.iconName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.iconName.message}
                </p>
              )}
            </div>

            {/* Icon Preview */}
            {selectedIcon && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Icon Önizləmə:
                </p>
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center">
                    <div className="w-12 h-12  flex items-center justify-center text-blue-600">
                      <IconPreview iconName={selectedIcon} />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 text-center mt-3 font-mono">
                  {selectedIcon}
                </p>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full"
                    size="large"
                    options={[
                      { value: "published", label: "✓ Aktiv" },
                      { value: "draft", label: "○ Deaktiv" },
                    ]}
                  />
                )}
              />
            </div>
          </FieldBlock>

          {/* Info Note */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="text-sm text-yellow-800">
              💡 <strong>Qeyd:</strong> Dəyişiklikləri yadda saxlamaq üçün
              Yenilə düyməsini basın
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
}
