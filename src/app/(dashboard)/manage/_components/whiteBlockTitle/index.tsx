"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";

interface Props {
  title: string;
  link?: string;
  disabled?: boolean;
}

const WhiteBlockTitleArea = ({ link, title, disabled = false }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleReload = () => {
    setLoading(true);
    window.location.reload();
  };

  return (
    <div className="mb-6 flex items-center gap-4 justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 font-poppins">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">Məlumatları idarə edin</p>
      </div>
      {!disabled && (
        <div className="flex items-center gap-3">
          <button
            aria-label="Reload Page"
            onClick={handleReload}
            type="button"
            disabled={loading}
            className="group w-11 h-11 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-5 h-5 transition-transform ${
                loading ? "animate-spin" : "group-hover:rotate-180"
              }`}
            />
          </button>

          <Link
            href={link ?? ""}
            className="group flex items-center gap-2.5 bg-blue-600 text-white h-11 rounded-xl text-sm font-semibold px-6 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Əlavə et
          </Link>
        </div>
      )}
    </div>
  );
};

export default React.memo(WhiteBlockTitleArea);
