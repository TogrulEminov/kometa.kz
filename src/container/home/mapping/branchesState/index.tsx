// components/BranchStats.tsx
"use client";
import { useTranslations } from "next-intl";
import React from "react";

interface Props {
  activeCount: number;
  plannedCount: number;
  totalOffices: number;
  totalCountries: number;
}

export default function BranchStats({
  activeCount,
  plannedCount,
  totalCountries,
  totalOffices,
}: Props) {
  const t = useTranslations("branches");
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {totalCountries}
        </div>
        <div className="text-sm text-ui-7">{t("countries")}</div>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="text-3xl font-bold mb-1">{activeCount}</div>
        <div className="text-sm text-green-50">{t("activeCountry")}</div>
      </div>
      <div className="bg-gradient-to-br from-ui-4 to-ui-1 rounded-2xl p-6 text-white shadow-lg">
        <div className="text-3xl font-bold mb-1">{plannedCount}</div>
        <div className="text-sm text-blue-50">{t("plannedCount")}</div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {totalOffices}
        </div>
        <div className="text-sm text-ui-7">{t("totalOffices")}</div>
      </div>
    </div>
  );
}
