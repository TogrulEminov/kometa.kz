import { useTranslations } from "next-intl";
interface Props {
  className?: string;
}
export default function NoData({ className }: Props) {
  const t = useTranslations();
  return (
    <div
      className={`py-24 flex items-center justify-center col-span-6 ${className}`}
    >
      <div className="container px-4">
        <article className="flex items-center justify-center max-w-md flex-col gap-y-6 text-center mx-auto">
          {/* Simple Icon */}
          <div className="w-24 h-24 rounded-2xl bg-ui-5 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-ui-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-ui-1">
              {t("noResultComponent.title")}
            </h3>
            <p className="text-ui-7 text-sm leading-relaxed">
              {t("noResultComponent.description")}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
