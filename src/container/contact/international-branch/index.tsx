import { BranchItem } from "@/src/services/interface";
import { getTranslations } from "next-intl/server";
import React from "react";

interface Props {
  branches: BranchItem[];
}

export default async function InternationalBranchesV1({ branches }: Props) {
  const t = await getTranslations();

  if (!branches?.length) {
    return null;
  }

  return (
    <section className="py-10 lg:py-15 bg-gray-50">
      <div className="container">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-ui-4/10 text-ui-4 rounded-full text-sm font-semibold mb-4">
            {t("contactForm.offices.subtitle")}
          </span>
          <h4 className="text-3xl lg:text-4xl font-bold text-ui-1 mb-3">
            {t("contactForm.offices.title")}
          </h4>
          <p className="text-ui-7 max-w-2xl mx-auto">
            {t("contactForm.offices.description", {
              count: branches.length,
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches?.map((item) => {
            const translations = item?.translations?.[0];
            const offices = item?.offices || [];

            // Filter by type
            const officeLocations = offices.filter(
              (office) => office.type === "office"
            );
            const warehouseLocations = offices.filter(
              (office) => office.type === "warehouse"
            );
            const officeCount = officeLocations.length;
            const warehouseCount = warehouseLocations.length;

            return (
              <div
                key={item?.documentId}
                className="bg-white rounded-2xl border border-gray-200 hover:border-ui-4 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform bg-gradient-to-br from-ui-4 to-ui-11">
                      <span className="text-white font-bold text-lg">
                        {item?.isoCode}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-ui-1 text-lg">
                        {translations?.countryName}
                      </h5>
                      <p className="text-sm text-ui-7">
                        {offices.length} {t("branches.modal.locations")}
                      </p>
                    </div>
                  </div>

                  {/* Type Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {officeCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {officeCount} {t("branches.office")}
                      </span>
                    )}
                    {warehouseCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        {warehouseCount} {t("branches.warehouse")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Offices/Warehouses List */}
                {offices.length > 0 && (
                  <div className="p-6">
                    {/* Section Title */}
                    <h6 className="text-xs font-semibold text-ui-7 uppercase tracking-wider mb-3">
                      {t("branches.modal.locations")}
                    </h6>

                    <div className="space-y-3">
                      {offices.map((office: any, idx: number) => {
                        const isWarehouse = office.type === "warehouse";

                        return (
                          <div
                            key={idx}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                              isWarehouse
                                ? "bg-amber-50 hover:bg-amber-100"
                                : "bg-blue-50 hover:bg-blue-100"
                            }`}
                          >
                            {isWarehouse ? (
                              <svg
                                className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-ui-1">
                                  {office?.translations?.[0]?.city}
                                </p>
                                <span
                                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                    isWarehouse
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {isWarehouse
                                    ? t("branches.warehouse")
                                    : t("branches.office")}
                                </span>
                              </div>
                              <p className="text-xs text-ui-7">
                                {office?.translations?.[0]?.address}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
