import React from "react";
import Icons from "@/public/icons";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
interface Props {
  previousData: any;
}
export default function PreviesNextData({ previousData }: Props) {
  const t = useTranslations();
  return (
    <div className="flex items-center justify-between gap-4 pt-8 border-t border-ui-2">
      {/* Previous */}
      {previousData?.previous && (
        <Link
          href={{
            pathname: "/blog/[slug]",
            params: { slug: previousData?.previous?.slug },
          }}
          className="group flex items-center gap-2 text-ui-7 hover:text-ui-1 transition-colors"
        >
          <Icons.ArrowLeft />
          <div>
            <p className="text-xs text-gray-500">{t("blogPage.before")}</p>
            <p className="font-medium text-sm">
              {previousData?.previous?.title}
            </p>
          </div>
        </Link>
      )}
      {/* Center dot */}
      <div className="w-2 h-2 rounded-full bg-gray-300"></div>

      {/* Next */}
      {previousData?.next && (
        <Link
          href={{
            pathname: "/blog/[slug]",
            params: { slug: previousData?.next.slug },
          }}
          className="group flex items-center gap-2 text-ui-7 hover:text-ui-1 transition-colors text-right"
        >
          <div>
            <p className="text-xs text-gray-500">{t("blogPage.latest")}</p>
            <p className="font-medium text-sm">{previousData?.next?.title}</p>
          </div>
          <Icons.ChevronRight />
        </Link>
      )}
    </div>
  );
}
