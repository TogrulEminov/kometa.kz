"use client";

import Icons from "@/public/icons";
import { getSlug } from "@/src/actions/ui/get-slug.actions";
import useOutSideClick from "@/src/hooks/useOutSideClick";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { MotionDiv } from "@/src/lib/motion/motion";
import { AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import React, { useRef, useTransition } from "react";
import type { Locale } from "next-intl";

export default function LanguageDropdown() {
  const ref = useRef<HTMLDivElement>(null);
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { handleToggle, open, handleClose } = useOutSideClick({ ref });
  const [isPending, startTransition] = useTransition();

  const languages = [
    {
      code: "az" as const,
      name: "Az",
      display: "Az",
    },
    {
      code: "en" as const,
      name: "En",
      display: "En",
    },
    {
      code: "ru" as const,
      name: "Ru",
      display: "Ru",
    },
  ];

  const handleChangeLanguage = async (newLocale: Locale) => {
    if (currentLocale === newLocale || isPending) return;

    handleClose();

    startTransition(async () => {
      try {
        const { slug } = params;
        let newSlug = slug;

        // Pathname-dən type-ı götür
        const pathSegments = pathname.split("/").filter(Boolean);
        const type = pathSegments[0];

        // Əgər slug varsa, tərcümə olunmuş slug-u götür
        if (slug && typeof slug === "string" && type) {
          const translatedSlug = await getSlug(
            currentLocale,
            newLocale,
            slug,
            type
          );
          newSlug = translatedSlug;
        }

        // Yeni params obyektini yarat
        const newParams = {
          ...params,
          ...(newSlug && typeof newSlug === "string" ? { slug: newSlug } : {}),
        };

        // Router-ə yönləndir
        router.push(
          {
            pathname,
            params: newParams,
          } as any,
          { locale: newLocale }
        );
      } catch (error) {
        console.error("Language change error:", error);
        // Fallback: sadəcə dil dəyişdir
        router.push(pathname as any, { locale: newLocale });
      }
    });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="flex items-center cursor-pointer gap-x-2 text-ui-1 font-montserrat text-sm xl:text-base font-medium uppercase -tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Select language"
      >
        {currentLocale}
        <Icons.ArrowSmall
          className={`mt-1 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <MotionDiv
            className="flex flex-col absolute min-w-20 shadow-1 bg-white right-0 mt-4 rounded-sm z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {languages.map((language) => (
              <button
                type="button"
                key={language.code}
                onClick={() => handleChangeLanguage(language.code)}
                disabled={isPending}
                className={`items-center w-full uppercase p-3 rounded-[2px] transition-colors ease-in-out cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentLocale === language.code ? "hidden" : "flex"
                }`}
                aria-label={`Change language to ${language.name}`}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </span>
                ) : (
                  language.name
                )}
              </button>
            ))}
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
