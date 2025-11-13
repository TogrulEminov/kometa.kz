import React from "react";
import { Link } from "@/src/i18n/navigation";
import { SectionContent } from "@/src/services/interface";
import { stripHtmlTags } from "@/src/lib/domburify";
import { useTranslations } from "next-intl";
interface Props {
  sectionData: SectionContent;
}
export default function ServicesCta({ sectionData }: Props) {
  const t = useTranslations();
  return (
    <>
      <section className="pb-10 lg:pb-25">
        <div className="container">
          <div className="text-center p-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl shadow-lg">
            <div className="mb-4">
              <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-2 text-white text-sm font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                {sectionData?.translations?.[0]?.subTitle ||
                  "Ağır yükləriniz bizimlə yüngülləşir"}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {sectionData?.translations?.[0]?.title ||
                "70% daha az stress, 100% daha çox nəticə"}
            </h3>
            <p className="text-slate-200 mb-6">
              {stripHtmlTags(sectionData?.translations?.[0]?.description) ||
                "Rəqəmlər danışır: müştərilərimiz logistika işlərini bizə həvalə etdikdən sonra əsas bizneslərinə 3 dəfə çox vaxt ayıra bilirlər"}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-800 font-semibold rounded-xl hover:bg-slate-50 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {t("cta.advise")}
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("cta.aboutUs")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
