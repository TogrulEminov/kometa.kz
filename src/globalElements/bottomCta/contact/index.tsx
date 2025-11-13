import React from "react";
import CustomLink from "next/link";
import { Link } from "@/src/i18n/navigation";
import { ContactInfo, SectionContent } from "@/src/services/interface";
import { clearPhoneRegex, stripHtmlTags } from "@/src/lib/domburify";
import { useTranslations } from "next-intl";
interface Props {
  main?: boolean;
  contactData: ContactInfo;
  contactCta: SectionContent;
}
export default function ContactCta({
  main = false,
  contactCta,
  contactData,
}: Props) {
  const t = useTranslations();
  return (
    <section className={`${main ? "py-10 lg:py-25 " : "pb-10 lg:pb-25 "}`}>
      <div className="container">
        <div className="text-center p-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-3">
            {contactCta?.translations?.[0]?.title}
          </h3>
          <p className="text-slate-200 mb-6">
            {stripHtmlTags(contactCta?.translations?.[0]?.description)}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-800 font-semibold rounded-xl hover:bg-slate-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {t("cta.contactUs")}
            </Link>
            {contactData?.phone && (
              <CustomLink
                href={`tel:${clearPhoneRegex(contactData?.phone)}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {t("cta.callUs")}
              </CustomLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
