"use client";
import Icons from "@/public/icons";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React from "react";

export default function ShareButton({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  const { success, error } = useMessageStore();
  const pathname = usePathname();
  const t = useTranslations();
  const handleClick = async () => {
    const url = `${window.location.origin}${pathname}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: t("shareText"),
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        success("Coppy successfully");
      }
    } catch (err) {
      console.log(err);

      error("Link does not share");
    }
  };
  return (
    <button
      className={className}
      type="button"
      role="button"
      aria-label="Share button"
      onClick={handleClick}
    >
      <Icons.Share /> <span>{t("share")}</span>
    </button>
  );
}
