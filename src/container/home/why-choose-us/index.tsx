import React from "react";
import { Link } from "@/src/i18n/navigation";
import CustomImage from "@/src/globalElements/ImageTag";
import { AdvantagesItem, Features, FileType } from "@/src/services/interface";
import { getForCards } from "@/src/utils/getFullimageUrl";
import { getTranslations } from "next-intl/server";
import { stripHtmlTags } from "@/src/lib/domburify";
interface Props {
  sectionData: Features;
  advantagesData: AdvantagesItem[];
}
export default async function WhyChoosUs({
  sectionData,
  advantagesData,
}: Props) {
  const t = await getTranslations();
  if (!sectionData) {
    return null;
  }
  return (
    <section className="py-10 lg:py-25 relative">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-5">
          <div className="flex flex-col space-y-6 order-2 lg:order-1">
            <span className="global-span">
              {sectionData?.translations?.[0]?.subtitle}
            </span>
            <strong className="global-strong">
              {sectionData?.translations?.[0]?.title}
            </strong>
            {sectionData?.translations?.[0]?.description && (
              <p className="global-pharagraph">
                {stripHtmlTags(sectionData?.translations?.[0]?.description)}
              </p>
            )}
            <Link href={"/about"} className="global-link">
              {t("moreAbout")}
            </Link>
          </div>
          <div className="p-4 shadow-1 rounded-[2px] bg-white h-64 lg:h-101 relative order-1 lg:order-2">
            <video
              className="w-full h-full object-cover rounded-[2px]"
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src={getForCards(sectionData?.videoUrl as FileType)}
                type="video/mp4"
              />
            </video>
          </div>
          {advantagesData?.length > 0 && (
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 order-3">
              {advantagesData?.map((item, index) => {
                const { title, description } = item?.translations?.[0];
                return (
                  <div className="flex items-start gap-x-3" key={index}>
                    <figure className="w-12 h-12 lg:w-18 lg:h-18 rounded-full shrink-0 flex items-center justify-center bg-ui-4">
                      <CustomImage
                        src={getForCards(item.imageUrl as FileType)}
                        width={32}
                        height={32}
                        className="w-6 h-6 lg:w-8 lg:h-8  object-contain invert-100 "
                        title=""
                      />
                    </figure>
                    <article className="flex flex-col space-y-2 lg:space-y-4">
                      <strong className="text-ui-1 text-base lg:text-xl font-bold">
                        {title}
                      </strong>
                      <p className="text-sm text-ui-7 min-h-10 line-clamp-2 text-ellipsis">
                        {stripHtmlTags(description)}
                      </p>
                    </article>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
