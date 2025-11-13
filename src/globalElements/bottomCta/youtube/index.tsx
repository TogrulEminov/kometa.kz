import React from "react";
import CustomLink from "next/link";
import { SectionContent, Social } from "@/src/services/interface";
import { useTranslations } from "next-intl";
import { stripHtmlTags } from "@/src/lib/domburify";
interface Props {
  sectionCta: SectionContent;
  socialData: Social;
}
export default function YoutubeCta({ sectionCta, socialData }: Props) {
  const t = useTranslations();
  if (!sectionCta.translations || !socialData) return null;
  return (
    <section className="pb-10 lg:pb-25">
      <div className="container">
        <div className="text-center p-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-3">
            {sectionCta?.translations[0]?.title ||
              "Bizim YouTube kanalımızı izləyin!"}
          </h3>
          <p className="text-slate-200 mb-6">
            {stripHtmlTags(sectionCta?.translations?.[0]?.description) ||
              "Ən yeni videolarımızdan xəbərdar olmaq və maraqlı məzmunu qaçırmamaq üçün kanalımıza abunə olun"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <CustomLink
              href={socialData?.socialName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-800 font-semibold rounded-xl hover:bg-slate-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              {t("cta.lookChannel")}
            </CustomLink>

            <CustomLink
              href={socialData?.socialName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              {t("cta.share")}
            </CustomLink>
          </div>
        </div>
      </div>
    </section>
  );
}
