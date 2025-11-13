import React from "react";
import { Link } from "@/src/i18n/navigation";
import { SectionContent } from "@/src/services/interface";
import { stripHtmlTags } from "@/src/lib/domburify";
import { useTranslations } from "next-intl";
interface Props {
  existingData: SectionContent;
}
export default function BlogCta({ existingData }: Props) {
  const t = useTranslations();
  if (!existingData) return null;
  return (
    <section className="pb-10 lg:pb-25">
      <div className="container">
        <div className="text-center p-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-3">
            {existingData?.translations?.[0]?.title ||
              "Daha ətraflı məlumat almaq istəyirsiniz?"}
          </h3>
          <p className="text-slate-200 mb-6">
            {stripHtmlTags(existingData?.translations?.[0]?.description) ||
              "Logistika xidmətlərimiz haqqında məsləhət almaq və ya layihənizi müzakirə etmək üçün bizimlə əlaqə saxlayın"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-800 font-semibold rounded-xl hover:bg-slate-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {t("cta.advise")}
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  clipRule="evenodd"
                />
              </svg>
              {t("cta.services")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
