import PartnersCards from "@/src/globalElements/cards/partners";
import React from "react";
import { Link } from "@/src/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ConnectionItem, SectionContent } from "@/src/services/interface";
import { stripHtmlTags } from "@/src/lib/domburify";
interface Props {
  existingData: ConnectionItem[];
  sectionData: SectionContent;
}
export default async function PartnersSection({
  existingData,
  sectionData,
}: Props) {
  const t = await getTranslations();

  if (!existingData.length || !sectionData) return null;
  return (
    <section className="py-10 lg:py-25  bg-gray-50 overflow-hidden">
      <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article className="flex items-center justify-between  lg:col-span-4">
          <div className="flex flex-col space-y-4">
            <span className="global-span text-sm!">
              {sectionData?.translations?.[0]?.subTitle}
            </span>
            <h2 className="global-strong lg:text-3xl!">
              {sectionData?.translations?.[0]?.title}
            </h2>
            {sectionData?.translations?.[0]?.description && (
              <p className="global-pharagraph  max-w-3xl">
                {stripHtmlTags(sectionData?.translations?.[0]?.description)}
              </p>
            )}
            <Link
              href={"/partner"}
              className="text-ui-4 underline pb-2 font-bold font-base transition-all duration-300 hover:no-underline"
            >
              {t("more")}
            </Link>
          </div>
        </article>
        <div className="grid  grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:col-span-8">
          {existingData?.map((item: any, index: number) => {
            return <PartnersCards item={item} key={item?.id || index} />;
          })}
        </div>
      </div>
    </section>
  );
}
