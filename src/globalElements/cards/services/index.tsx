import { Link } from "@/src/i18n/navigation";
import React from "react";
import CustomImage from "../../ImageTag";
import Icons from "@/public/icons";
import { FileType, ServicesItem } from "@/src/services/interface";
import { getForCards } from "@/src/utils/getFullimageUrl";
import { stripHtmlTags } from "@/src/lib/domburify";
import { useTranslations } from "next-intl";
interface Props {
  item: ServicesItem;
}
export default function ServicesCard({ item }: Props) {
  const { translations, imageUrl, iconsUrl } = item;
  const t = useTranslations();
  const { slug, title, description } = translations?.[0];
  return (
    <Link
      href={{
        pathname: "/services/[slug]",
        params: { slug },
      }}
      className="block overflow-hidden transition-transform duration-500 p-4 group border border-ui-3  rounded-md bg-white"
    >
      <figure className="rounded-top-md overflow-hidden rounded-md h-[250px] lg:h-[307px]">
        <CustomImage
          width={407}
          height={307}
          src={getForCards(imageUrl as FileType)}
          title={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </figure>
      <article className="flex flex-col space-y-4">
        <div className="bg-ui-6 py-2 lg:py-4 px-3 lg:px-5 -mt-7.5 relative rounded-md mx-2 lg:mx-5 flex items-center justify-between">
          <strong className="text-ui-1 font-bold  text-sm lg:text-lg">
            {title}
          </strong>
          <figure className="w-10 h-10 lg:w-15 lg:h-15 rounded-full  shrink-0 flex items-center justify-center duration-500 transition-all bg-white group-hover:bg-ui-4">
            <CustomImage
              src={getForCards(iconsUrl as FileType)}
              width={35}
              height={35}
              className="w-5.5 lg:w-8.5 h-5.5 lg:h-8.5 transition-transform duration-500 group-hover:invert-100 group-hover:brightness-1"
              title={title}
            />
          </figure>
        </div>

        <p className="text-ui-7 font-medium  tracking-normal line-clamp-2 min-h-10 xl:min-h-12.5 text-ellipsis text-sm lg:text-base">
          {stripHtmlTags(description)}
        </p>
        <div className="py-3 pt-5  border-t border-t-ui-2">
          <span className="flex items-center gap-x-2 text-sm lg:text-base font-medium text-ui-1 transition-all duration-500 group-hover:gap-x-3 ">
            {t("moreAbout")} <Icons.RightIcons />
          </span>
        </div>
      </article>
    </Link>
  );
}
