import { Home } from "lucide-react";
import Link from "next/link";
import React from "react";
import GoBack from "./button";

type NotFoundContainerProps = {
  locale: "az" | "en" | "ru";
};

const translations = {
  az: {
    title: "Səhifə Tapılmadı",
    description:
      "Axtardığınız səhifə mövcud deyil və ya köçürülüb. Zəhmət olmasa əsas səhifəyə qayıdın.",
    homeButton: "Ana Səhifə",
    popularLinks: "Populyar səhifələrə keçid:",
    links: {
      about: "Haqqımızda",
      services: "Xidmətlər",
      blog: "Blog",
      contact: "Əlaqə",
    },
  },
  en: {
    title: "Page Not Found",
    description:
      "The page you are looking for does not exist or has been moved. Please return to the home page.",
    homeButton: "Home Page",
    popularLinks: "Popular pages:",
    links: {
      about: "About Us",
      services: "Services",
      blog: "Blog",
      contact: "Contact",
    },
  },
  ru: {
    title: "Страница не найдена",
    description:
      "Страница, которую вы ищете, не существует или была перемещена. Пожалуйста, вернитесь на главную страницу.",
    homeButton: "Главная страница",
    popularLinks: "Популярные страницы:",
    links: {
      about: "О нас",
      services: "Услуги",
      blog: "Блог",
      contact: "Контакты",
    },
  },
};

export default function NotFoundContainer({ locale }: NotFoundContainerProps) {
  const t = translations[locale];

  return (
    <div className="min-h-screen bg-ui-3 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-2xl w-full text-center relative">
        {/* 404 Text */}
        <div className="relative mb-6 sm:mb-8">
          <h1 className="text-[120px] sm:text-[180px] md:text-[280px] font-bold text-ui-2 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-ui-4/10 animate-pulse" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ui-1 leading-tight">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-ui-7 max-w-md mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 mb-12 sm:mb-16">
          <GoBack locale={locale} />
          <Link
            href={`/${locale}`}
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-ui-4 text-white rounded-lg font-semibold hover:bg-ui-11 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">{t.homeButton}</span>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-ui-2 px-4">
          <p className="text-ui-7 font-medium mb-4 sm:mb-6 text-sm sm:text-base">
            {t.popularLinks}
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            <Link
              href={`/${locale}/about`}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-ui-6 text-ui-1 rounded-full hover:bg-ui-4 hover:text-white transition-all duration-300"
            >
              {t.links.about}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-ui-6 text-ui-1 rounded-full hover:bg-ui-4 hover:text-white transition-all duration-300"
            >
              {t.links.services}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-ui-6 text-ui-1 rounded-full hover:bg-ui-4 hover:text-white transition-all duration-300"
            >
              {t.links.blog}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-ui-6 text-ui-1 rounded-full hover:bg-ui-4 hover:text-white transition-all duration-300"
            >
              {t.links.contact}
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-ui-4/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" />
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-20 h-20 sm:w-32 sm:h-32 bg-ui-11/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" />
      </div>
    </div>
  );
}
