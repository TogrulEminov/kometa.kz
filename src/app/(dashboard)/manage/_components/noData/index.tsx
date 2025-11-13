import React from "react";
import Link from "next/link";
import noDataImage from "@/public/assets/noData.png";
import CustomImage from "@/src/globalElements/ImageTag";

const NoDataInfo = ({
  title = "Əlavə et",
  link,
}: {
  title?: string;
  link?: string;
}) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white rounded-2xl border-4 border-dashed border-slate-200 p-12">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Image with Info Badge */}
          <div className="relative">
            <div className="w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center">
              <CustomImage
                src={noDataImage}
                title="No data"
                width={100}
                height={100}
                className="w-24 h-24"
              />
            </div>
            {/* Info Icon Badge */}
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">
              Heç bir məlumat tapılmadı
            </h2>
            <p className="text-slate-600 text-sm max-w-sm">
              Bu bölmədə hələ heç bir məlumat əlavə edilməyib. Yeni məlumat
              əlavə etmək üçün aşağıdakı düyməyə klikləyin.
            </p>
          </div>

          {/* Action Button */}
          {link && (
            <Link
              href={link}
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl group cursor-pointer"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {title}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(NoDataInfo);
