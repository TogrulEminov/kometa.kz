import React from "react";
import SliderArea from "./slider";
import { Employee, SectionContent } from "@/src/services/interface";
import { stripHtmlTags } from "@/src/lib/domburify";
import { getTranslations } from "next-intl/server";
interface Props {
  existingData: Employee[];
  sectionData: SectionContent;
}
export default async function EmployeeSection({
  existingData,
  sectionData,
}: Props) {
  const t = await getTranslations();
  if (!existingData?.length) return null;
  return (
    <section className="py-10 lg:py-15">
      <div className="container">
        <article className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div className="lg:max-w-2xl">
            <strong className="text-2xl md:text-4xl lg:text-5xl font-bold text-ui-1 block mb-3">
              {sectionData?.translations?.[0]?.title}
            </strong>
            {sectionData?.translations?.[0]?.description && (
              <p className="text-ui-7 text-base lg:text-lg mb-4">
                {stripHtmlTags(sectionData?.translations?.[0]?.description)}
              </p>
            )}
            {/* Kiçik badge-lər */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {t("employeeData.one")}
              </span>

              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {t("employeeData.two")}
              </span>

              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {t("employeeData.three")}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-ui-4 text-white px-6 py-3 rounded-full text-sm font-medium">
              {sectionData?.translations?.[0]?.subTitle}
            </div>
          </div>
        </article>
        <SliderArea existingData={existingData as any} />
      </div>
    </section>
  );
}
