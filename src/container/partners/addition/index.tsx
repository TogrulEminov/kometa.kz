import { stripHtmlTags } from "@/src/lib/domburify";
import { useTranslations } from "next-intl";

interface Props {
  title: string;
  description: string;
  metaTitle: string;
}
export default function AdditionPartners({
  title,
  description,
  metaTitle,
}: Props) {
  const t = useTranslations();
  return (
    <section className="py-10 lg:py-15">
      <div className="container">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h1
              title={metaTitle}
              className="text-3xl lg:text-4xl font-bold text-ui-1"
            >
              {title}
            </h1>
            <p className="text-sm text-ui-7 mt-1">{t("partnersSection.one")}</p>
          </div>
        </div>

        <div className="max-w-4xl">
          <p className="text-lg text-ui-7 leading-relaxed">
            {stripHtmlTags(description)}
          </p>
        </div>
      </div>
    </section>
  );
}
