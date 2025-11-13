// app/(dashboard)/manage/socials/_components/SocialCard.tsx
"use client";
import React from "react";
import { Card, Button, Popconfirm, Tag, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import Icons from "@/public/icons";
import {
  deleteSocial,
  toggleSocialStatus,
} from "@/src/actions/client/social.actions";
import Link from "next/link";

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
  social: Social;
  onEdit: () => void;
  onRefetch: () => void;
}

export default function SocialCard({ social, onEdit, onRefetch }: Props) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isToggling, setIsToggling] = React.useState(false);
  const { success, error } = useMessageStore();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteSocial(social.documentId);
      if (result.success) {
        success("Sosial şəbəkə uğurla silindi!");
        onRefetch();
      } else {
        error(result.error || "Silinərkən xəta baş verdi.");
      }
    } catch (err: unknown) {
      console.log("err", err);
      error("Gözlənilməz xəta baş verdi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsToggling(true);
    try {
      const result = await toggleSocialStatus(social.documentId);
      if (result.success) {
        success(result.message || "Status dəyişdirildi!");
        onRefetch();
      } else {
        error(result.error || "Status dəyişdirilərkən xəta baş verdi.");
      }
    } catch (err: unknown) {
      console.log("err", err);
      error("Gözlənilməz xəta baş verdi.");
    } finally {
      setIsToggling(false);
    }
  };

  const SocialIcon = ({ iconName }: { iconName: string }) => {
    const IconComponent = Icons[iconName as keyof typeof Icons];
    if (!IconComponent || typeof IconComponent !== "function") {
      return (
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-xs">
          ?
        </div>
      );
    }
    return IconComponent({ fill: "currentColor" });
  };

  return (
    <Card
      className="group relative overflow-hidden border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
      bodyStyle={{ padding: "20px" }}
    >
      {/* Status Badge - Top Right */}
      <div className="absolute top-3 right-3">
        <Tag
          color={social.status === "published" ? "success" : "default"}
          className="m-0"
        >
          {social.status === "published" ? "Aktiv" : "Deaktiv"}
        </Tag>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center pt-2">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <div className="w-12 h-12 flex items-center justify-center text-blue-600">
            <SocialIcon iconName={social.iconName} />
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
          {social.socialName}
        </h3>

        {/* Link */}
        <Tooltip title={social.socialLink}>
          <Link
            href={social.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 max-w-full truncate mb-4"
          >
            <LinkOutlined className="text-xs flex-shrink-0" />
            <span className="truncate">{social.socialLink}</span>
          </Link>
        </Tooltip>

        {/* Actions */}
        <div className="flex gap-2 w-full pt-3 border-t border-gray-100">
          <Tooltip
            title={social.status === "published" ? "Deaktiv et" : "Aktiv et"}
          >
            <Button
              type="text"
              size="small"
              loading={isToggling}
              onClick={handleToggleStatus}
              icon={
                social.status === "published" ? (
                  <EyeInvisibleOutlined />
                ) : (
                  <EyeOutlined />
                )
              }
              className="flex-1"
            />
          </Tooltip>

          <Tooltip title="Redaktə et">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={onEdit}
              className="flex-1 text-blue-600 hover:text-blue-700"
            />
          </Tooltip>

          <Popconfirm
            title="Əminsiniz?"
            description="Bu əməliyyat geri qaytarıla bilməz."
            onConfirm={handleDelete}
            okText="Bəli"
            cancelText="Xeyr"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Sil">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                loading={isDeleting}
                className="flex-1"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
}
