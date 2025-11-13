// components/BranchesMap.tsx
import React from "react";
import BranchStats from "./branchesState";
import BranchesMapClient from "./branchesMapClient";
import { BranchItem, SectionContent } from "@/src/services/interface";
import { stripHtmlTags } from "@/src/lib/domburify";
interface Props {
  sectionData: SectionContent;
  branches: BranchItem[];
}
export default async function BranchesMap({ sectionData, branches }: Props) {
  if (!branches || branches?.length === 0) return null;

  // Server-side hesablamalar
  const activeCount = branches.filter((b) => b.status === "ACTIVE").length;
  const plannedCount = branches.filter((b) => b.status === "PLANNED").length;
  const totalOffices = branches.reduce((sum, b) => sum + b.offices.length, 0);

  return (
    <section className="py-10 lg:py-20 bg-gradient-to-br bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <svg
                className="w-5 h-5 text-ui-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs lg:text-sm font-semibold text-ui-1">
                {sectionData?.translations?.[0]?.subTitle}
              </span>
            </div>
            <h2 className="text-2xl lg:text-4xl md:text-5xl font-bold text-ui-1 mb-4">
              {sectionData?.translations?.[0]?.title}
            </h2>
            {sectionData?.translations?.[0]?.description && (
              <p className="text-base text-ui-7 max-w-2xl mx-auto">
                {stripHtmlTags(sectionData?.translations?.[0]?.description)}
              </p>
            )}
          </div>

          {/* Statistika */}
          <BranchStats
            totalCountries={branches.length}
            activeCount={activeCount}
            plannedCount={plannedCount}
            totalOffices={totalOffices}
          />

          {/* İnteraktiv Xəritə */}
          <BranchesMapClient branches={branches as any} />
        </div>
      </div>
    </section>
  );
}
