"use client";
import CustomImage from "@/src/globalElements/ImageTag";
import { ContactInfo } from "@/src/services/interface";
import WordCycle from "@/src/ui-components/word-cycle";
import icons44 from "@/public/assets/icon-44.png";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

interface Props {
  data: ContactInfo;
}

export default function ReliabilityFeature({ data: contactData }: Props) {
  const t = useTranslations("reliability");
  const words = t.raw("words") as string[];

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden bg-gradient-dark-primary min-h-[320px] lg:min-h-[280px] flex items-center">
      {/* Fixed Background - Ayrı div-də */}
      <div className="hero-bg-fixed" />

      {/* Dark Overlay - Daha tünd */}
      <div className="absolute inset-0 bg-gradient-to-r from-ui-1/70 via-ui-1/50 to-ui-1/60" />
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left: Heading */}
          <div className="flex-1 max-w-2xl">
            <strong className="text-white text-3xl lg:text-5xl font-bold leading-tight text-center lg:text-left drop-shadow-lg">
              <span className="block mb-2">{t("title")}</span>
              <WordCycle
                words={words}
                typingSpeed={100}
                deletingSpeed={50}
                pauseTime={2000}
                className="text-ui-4"
              />
            </strong>
          </div>

          {/* Center: Icon */}
          <div className="shrink-0">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-ui-4/30 rounded-full blur-xl animate-pulse" />

              {/* Icon Container */}
              <figure className="relative w-20 h-20 lg:w-28 lg:h-28 flex items-center justify-center bg-gradient-to-br from-ui-4 via-ui-4 to-ui-11 rounded-full shadow-2xl">
                <CustomImage
                  width={56}
                  height={44}
                  src={icons44}
                  title="Icon"
                  className="w-11 h-9 lg:w-14 lg:h-11 object-contain"
                />
              </figure>
            </div>
          </div>

          {/* Right: Contact Info */}
          <article className="flex-1 max-w-md">
            <div className="bg-ui-1/60 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20 text-center lg:text-left shadow-xl">
              <strong className="text-white text-xl lg:text-3xl font-bold block mb-4 drop-shadow-md">
                {t("question")}
              </strong>
              <Link
                href={`mailto:${contactData?.email}`}
                className="group inline-flex items-center gap-3 text-white hover:text-ui-4 transition-colors text-base lg:text-lg"
              >
                <span className="w-10 h-10 bg-ui-4/30 transition-all duration-300 rounded-lg flex items-center justify-center group-hover:bg-ui-4 group-hover:text-white  shrink-0 shadow-md">
                  <svg
                    className="w-5 h-5 transition-all duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <span className="font-medium break-all drop-shadow-sm transition-all duration-300">
                  {contactData?.email}
                </span>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
