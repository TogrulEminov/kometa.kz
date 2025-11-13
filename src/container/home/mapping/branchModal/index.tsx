// components/BranchModal.tsx
"use client";
import { BranchItem } from "@/src/services/interface";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";

interface Props {
  branch: BranchItem;
  onClose: () => void;
}

export default function BranchModal({ branch, onClose }: Props) {
  const t = useTranslations("branches");

  // Filter offices by type
  const offices = branch.offices.filter((office) => office.type === "office");
  const warehouses = branch.offices.filter(
    (office) => office.type === "warehouse"
  );
  const officeCount = offices.length;
  const warehouseCount = warehouses.length;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        className="modal-overlay fixed inset-0 bg-[#003751]/30 backdrop-blur-sm z-[1000]"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-[#f8f9fa] px-6 lg:px-10 py-4 lg:py-8 border-b border-[#dee2e6]">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 cursor-pointer z-[3] rounded-xl bg-white hover:bg-[#ececec] border border-[#dee2e6] flex items-center justify-center transition-all duration-200 hover:scale-105"
              aria-label="Bağla"
            >
              <svg
                className="w-5 h-5 text-[#575a7b]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header Content */}
            <div className="header-text">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border bg-[#effaff] border-[#159dd1]/20`}
                >
                  <svg
                    className="w-6 h-6 text-[#159dd1]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full bg-[#159dd1]`} />
                    <span className="text-xs text-[#575a7b] font-medium uppercase tracking-wide">
                      {branch.status === "ACTIVE"
                        ? t("modal.active")
                        : t("modal.planned")}
                    </span>
                    {branch.isoCode && (
                      <>
                        <span className="text-[#dee2e6]">•</span>
                        <span
                          className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border text-[#159dd1] bg-[#effaff] border-[#159dd1]/20`}
                        >
                          {branch.isoCode}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-[#003751]">
                    {branch.countryName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Office Count */}
                {officeCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white border-[#dee2e6]">
                    <svg
                      className="w-4 h-4 text-[#159dd1]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-[#003751]">
                      {officeCount} {t("office")}
                    </span>
                  </div>
                )}

                {/* Warehouse Count */}
                {warehouseCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white border-[#f59e0b]/30">
                    <svg
                      className="w-4 h-4 text-[#f59e0b]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-[#92400e]">
                      {warehouseCount} {t("warehouse")}
                    </span>
                  </div>
                )}

                <div
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                    branch.status === "ACTIVE"
                      ? "bg-[#effaff] text-[#003751] border-[#159dd1]/30"
                      : "bg-[#fffbeb] text-[#92400e] border-[#fbbf24]/30"
                  }`}
                >
                  {branch.status === "ACTIVE"
                    ? t("modal.activety")
                    : t("modal.planned")}
                </div>
              </div>
            </div>
          </div>

          {/* Offices/Warehouses List */}
          <div className="px-6 lg:px-10 py-4 lg:py-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#f8f9fa]">
              <div>
                <h4 className="text-lg font-semibold text-[#003751] mb-1">
                  {t("modal.locations")}
                </h4>
                <p className="text-sm text-[#575a7b]">
                  {officeCount > 0 && warehouseCount > 0
                    ? `${officeCount} ${t("office")}, ${warehouseCount} ${t(
                        "warehouse"
                      )}`
                    : null}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center border bg-[#effaff] border-[#159dd1]/20">
                <span className="text-sm font-bold text-[#159dd1]">
                  {branch.offices.length}
                </span>
              </div>
            </div>

            {/* Scrollable Offices/Warehouses */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {branch.offices.map((office, index) => {
                const isWarehouse = office.type === "warehouse";

                return (
                  <div
                    key={office.id}
                    className={`office-card p-3.5 lg:p-4.5 ${
                      isWarehouse ? "warehouse-card" : ""
                    }`}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Number Badge */}
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                          isWarehouse
                            ? "bg-[#fffbeb] border-[#f59e0b]/30"
                            : "bg-[#f8f9fa] border-[#dee2e6]"
                        }`}
                      >
                        <span
                          className={`font-semibold text-sm ${
                            isWarehouse ? "text-[#f59e0b]" : "text-[#003751]"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>

                      {/* Office/Warehouse Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-base text-[#003751]">
                              {office.translations?.[0]?.city}
                            </h5>
                            {/* Type Badge */}
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                                isWarehouse
                                  ? "text-[#92400e] bg-[#fffbeb] border-[#f59e0b]/30"
                                  : "text-[#159dd1] bg-[#effaff] border-[#159dd1]/20"
                              }`}
                            >
                              {isWarehouse
                                ? `📦 ${t("warehouse")}`
                                : `🏢 ${t("office")}`}
                            </span>
                          </div>
                          <svg
                            className={`w-5 h-5 flex-shrink-0 ${
                              isWarehouse ? "text-[#f59e0b]" : "text-[#159dd1]"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>

                        {office.translations?.[0]?.address && (
                          <p className="text-sm text-[#575a7b] leading-relaxed">
                            {office.translations?.[0]?.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa;
          border-radius: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dee2e6;
          border-radius: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #159dd1;
        }

        /* Animations */
        @keyframes modalOverlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalContent {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes headerText {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes officeCard {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-overlay {
          animation: modalOverlay 0.25s ease-out;
        }

        .modal-content {
          animation: modalContent 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .header-text {
          animation: headerText 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }

        .office-card {
          background: #f9f9f9;
          border: 1px solid #dee2e6;
          border-radius: 14px;
          transition: all 0.2s ease;
          animation: officeCard 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .office-card:hover {
          background: white;
          border-color: #159dd1;
          box-shadow: 0 2px 8px rgba(21, 157, 209, 0.08);
          transform: translateX(4px);
        }

        .warehouse-card {
          background: #fffbeb;
        }

        .warehouse-card:hover {
          background: white;
          border-color: #f59e0b;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.08);
        }
      `}</style>
    </>
  );
}
