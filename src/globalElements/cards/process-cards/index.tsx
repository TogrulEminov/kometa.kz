import { stripHtmlTags } from "@/src/lib/domburify";
import { WorkProcessItem } from "@/src/services/interface";
import { useTranslations } from "next-intl";
import React from "react";
interface Props {
  item: WorkProcessItem;
  index: number;
}
export default function ProcessCards({ item, index }: Props) {
  const { title, description } = item?.translations?.[0];
  const t = useTranslations("");
  return (
    <div className="relative rounded-md bg-ui-3 p-5 lg:p-10 overflow-hidden min-h-[300px] group">
      <div className="absolute top-auto bottom-0 left-0 bg-ui-1 h-0 transition-all duration-300 z-0 right-0 block group-hover:h-full group-hover:top-0 group-hover:bottom-0" />
      <article className="flex flex-col space-y-2 relative z-2">
        <span className="text-base font-medium transition-colors text-ui-4 ease-in-out uppercase group-hover:text-white">
          {t("stage")}
        </span>
        <strong className="text-xl lg:text-2xl font-bold transition-all duration-300 ease-in-out text-ui-1 group-hover:text-white">
          {title}
        </strong>
        <p className="text-ui-7 text-base font-normal group-hover:text-white line-clamp-6">
          {stripHtmlTags(description)}
        </p>
      </article>
      <span className="process-num absolute -bottom-8 ">0{index}</span>
    </div>
  );
}
