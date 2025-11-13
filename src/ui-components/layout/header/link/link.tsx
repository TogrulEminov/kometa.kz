"use client";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";

export default function LinkComponent() {
  const t = useTranslations();
  return (
    <Link
      href="/contact"
      className="relative  text-sm xl:text-base overflow-hidden bg-ui-1 text-white cursor-pointer font-semibold rounded-md px-6 py-2 h-auto border-2 border-ui-1 hidden lg:block group transition-all duration-500"
    >
      {/* Loading bar effekti */}
      <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-ui-4 to-[#336fb3] w-0 group-hover:w-full transition-all duration-700 ease-out"></span>

      {/* Arxa fon gradient */}
      <span className="absolute inset-0 bg-gradient-to-br from-ui-4/0 to-[#336fb3]/0 group-hover:from-ui-4/20 group-hover:to-[#336fb3]/20 transition-all duration-500"></span>

      {/* Konteyner qutuları */}
      <span className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="w-3 h-3 bg-ui-4 rounded-sm animate-[stack_1.5s_ease-in-out_infinite]"></span>
        <span className="w-3 h-3 bg-[#336fb3] rounded-sm animate-[stack_1.5s_ease-in-out_infinite_0.3s]"></span>
        <span className="w-3 h-3 bg-ui-4 rounded-sm animate-[stack_1.5s_ease-in-out_infinite_0.6s]"></span>
      </span>

      {/* Rotasiya edən dairələr (yer kürəsi) */}
      <span className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
        <span className="block w-8 h-8 border-2 border-ui-4/40 rounded-full animate-[rotate_3s_linear_infinite]">
          <span className="block w-2 h-2 bg-ui-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
        </span>
      </span>

      <span className="relative z-10 group-hover:scale-105 inline-block transition-transform duration-300">
        {t("contactUs")}
      </span>

      <style jsx>{`
        @keyframes stack {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Link>
  );
}
