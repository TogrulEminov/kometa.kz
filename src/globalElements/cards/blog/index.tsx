import React from "react";
import CustomImage from "../../ImageTag";
import { Link } from "@/src/i18n/navigation";
import Icons from "@/public/icons";
import { BlogItem, FileType } from "@/src/services/interface";
import { getForCards } from "@/src/utils/getFullimageUrl";
import dayjs from "dayjs";
interface Props {
  item: BlogItem;
}
import "dayjs/locale/az";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import { useLocale, useTranslations } from "next-intl";
export default function BlogCards({ item }: Props) {
  const locale = useLocale();
  const { imageUrl, translations, createdAt } = item;
  const { title, slug } = translations?.[0];
  const t = useTranslations();
  dayjs.locale(locale);
  return (
    <Link
      href={{
        pathname: "/blog/[slug]",
        params: { slug: slug },
      }}
      className="bg-white  border border-ui-8 p-4 rounded-[15px] flex flex-col space-y-4 group"
    >
      <figure className="h-[240px] overflow-hidden rounded-[15px] w-full polygon">
        <CustomImage
          width={600}
          height={432}
          title=""
          className="transition-all object-cover  h-full ease-in-out duration-500 group-hover:scale-105"
          src={getForCards(imageUrl as FileType)}
        />
      </figure>
      <article className="flex flex-col space-y-4">
        <div className="flex items-center gap-x-3 justify-between">
          <time className="text-base capitalize font-normal text-ui-7 flex items-center gap-x-3">
            <Icons.Calendar fill="currentColor" />
            {dayjs(createdAt).format("MMMM D, YYYY")}
          </time>
        </div>
        <strong className="text-xl text-ui-1 font-bold block line-clamp-2 min-h-12.5 pb-4 border-b border-b-ui-7">
          {title}
        </strong>
        <span className="flex items-center  gap-x-3 transition-all duration-500 group-hover:gap-x-5">
          {t("moreAbout")} <Icons.RightIcons />
        </span>
      </article>
    </Link>
  );
}
