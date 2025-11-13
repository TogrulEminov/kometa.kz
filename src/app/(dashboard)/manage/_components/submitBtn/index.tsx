"use client";

import React, { useEffect, useState } from "react";

interface SubmitButtonProps {
  title?: string;
  isLoading: boolean;
  disabled?: boolean;
}

const SubmitAdminButton: React.FC<SubmitButtonProps> = ({
  title,
  isLoading,
  disabled,
}) => {
  const hasTitle = Boolean(title);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wasLoading, setWasLoading] = useState(false);

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  // Loading state dəyişikliyini izləyirik
  useEffect(() => {
    // Əgər loading true-dan false-a keçibsə və modal açıqdırsa
    if (wasLoading && !isLoading && isModalOpen) {
      // Kiçik gecikməylə modalı bağla (smooth UX üçün)
      const timer = setTimeout(() => {
        setIsModalOpen(false);
      }, 500);

      return () => clearTimeout(timer);
    }

    // Current loading state-i saxla
    setWasLoading(isLoading);
  }, [isLoading, wasLoading, isModalOpen]);

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
        disabled={disabled}
        className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ease-in-out relative overflow-hidden group ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 cursor-pointer hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
        }`}
      >
        {/* Hover Effect Background */}
        {!isLoading && (
          <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {hasTitle ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            )}
          </svg>
          <span>{hasTitle ? "Yenilə" : "Yarat"}</span>
        </span>
      </button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => !isLoading && setIsModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 fade-in duration-200">
              {/* Close Button */}
              {!isLoading && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                {hasTitle ? "Yeniləməyi təsdiqləyin" : "Yaratmağı təsdiqləyin"}
              </h3>

              {/* Message */}
              <p className="text-center text-gray-600 mb-6">
                {hasTitle
                  ? "Məlumatları yeniləmək istədiyinizdən əminsiniz?"
                  : "Yeni məlumat yaratmaq istədiyinizdən əminsiniz?"}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 cursor-pointer py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Ləğv et
                </button>

                {/* Real Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 cursor-pointer px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {hasTitle ? "Yenilənir..." : "Yaradılır..."}
                    </span>
                  ) : (
                    "Bəli, təsdiq edirəm"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(SubmitAdminButton);
