"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type GoBackProps = {
  locale: "az" | "en" | "ru";
};

const buttonTexts = {
  az: "Geri Qayıt",
  en: "Go Back",
  ru: "Назад",
};

export default function GoBack({ locale }: GoBackProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="group flex items-center cursor-pointer justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-ui-1 border-2 border-ui-2 rounded-lg font-semibold hover:bg-ui-5 hover:border-ui-4 transition-all duration-300"
    >
      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm sm:text-base">{buttonTexts[locale]}</span>
    </button>
  );
}
