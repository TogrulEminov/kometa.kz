// app/(dashboard)/manage/socials/_components/SocialCreateModal.tsx
"use client";
import React, { useTransition } from "react";
import { Modal, Select, Space } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import CustomAdminInput from "@/src/app/(dashboard)/manage/_components/createInput";
import FieldBlock from "@/src/app/(dashboard)/manage/_components/contentBlock";
import {
  CreateSocialInput,
  createSocialSchema,
} from "@/src/schema/social.schema";
import { createSocial } from "@/src/actions/client/social.actions";
import Icons from "@/public/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
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

export default function SocialCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const { success, error } = useMessageStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateSocialInput>({
    resolver: zodResolver(createSocialSchema),
    defaultValues: {
      socialName: "",
      socialLink: "",
      iconName: "",
      status: "published",
    },
  });

  const selectedIcon = watch("iconName");

  const onSubmit = async (data: CreateSocialInput) => {
    startTransition(async () => {
      const result = await createSocial(data);

      if (result.success) {
        success("Sosial şəbəkə uğurla yaradıldı!");
        reset();
        onClose();
        onSuccess();
      } else {
        error(result.error || "Yaradılarkən xəta baş verdi.");
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
        <div className="text-xl font-semibold">Yeni Sosial Şəbəkə Əlavə Et</div>
      }
      open={isOpen}
      onCancel={handleCancel}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isPending}
      width={650}
      okText="Yarat"
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
                  <div className="w-12 h-12 flex items-center justify-center text-blue-600">
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
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Məsləhət:</strong> Link-i tam şəkildə daxil edin
            (https:// ilə başlayan)
          </p>
        </div>
      </form>
    </Modal>
  );
}
