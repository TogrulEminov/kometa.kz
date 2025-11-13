// components/MapLegend.tsx
"use client";
import { useTranslations } from "next-intl";
import React from "react";

export default function MapLegend() {
  const t = useTranslations("branches");
  return (
    <div className="hidden lg:block absolute bottom-6 left-6 bg-white/98 backdrop-blur rounded-xl p-4 shadow-xl border border-gray-200">
      <strong className="font-bold text-xs text-gray-800 mb-3">
        {t("mapComment")}
      </strong>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-gray-700 font-medium"> {t("mapComment")}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-gray-700 font-medium">
            {t("plannedSpread")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded bg-slate-200"></div>
          <span className="text-gray-700 font-medium">{t("otherCountry")}</span>
        </div>
      </div>
    </div>
  );
}
