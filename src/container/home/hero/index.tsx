import React from "react";
import Link from "next/link";
import Icons from "@/public/icons";
import HeroImg from "./img";
import { ModalTrigger } from "@/src/globalElements/modal";
import HeroModal from "./modal";
import {
  CountGenericType,
  Hero,
  InfoGenericType,
} from "@/src/services/interface";
import { parseJSON } from "@/src/utils/checkSlug";
interface Props {
  data: Hero;
}
export default async function HeroSection({ data }: Props) {
  const translations = data?.translations?.[0];

  // Title-ı highlight ediləcək sözə görə ayırır
  const renderTitle = (title, highlightWord) => {
    if (!highlightWord || !title.includes(highlightWord)) {
      return title;
    }

    const parts = title.split(highlightWord);
    return (
      <>
        {parts[0] && <span>{parts[0].trim()}</span>}
        <span className="bg-gradient-to-r from-ui-4 to-blue-400 bg-clip-text text-transparent">
          {" " + highlightWord + " "}
        </span>
        {parts[1] && <span>{parts[1].trim()}</span>}
      </>
    );
  };

  return (
    <>
      <section className="relative min-h-[90vh] py-20 flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <HeroImg img={data?.imageUrl} />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-ui-1 opacity-80"></div>

        {/* Main Content */}
        <div className="container relative z-20 px-3 sm:px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs lg:text-base font-medium mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-ui-4 rounded-full animate-ping"></span>
              {translations?.badge}
            </div>

            {/* Main Heading - Single Text Format */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl  font-black text-white mb-4 leading-tight tracking-tight">
              {renderTitle(translations?.title, translations?.highlightWord)}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 max-w-2xl mx-auto font-light leading-relaxed">
              {translations?.subtitle}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 max-w-3xl mx-auto">
              {parseJSON<InfoGenericType>(translations?.features)?.map(
                (feature, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-center gap-2 p-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex-shrink-0 size-8 bg-ui-4 text-ui-2 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icons.CheckIcons />
                    </div>
                    <span className="text-white font-medium text-xs sm:text-sm">
                      {feature?.title}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* CTA Buttons - Smaller Height & Padding */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <ModalTrigger
                modalKey="hero-modal"
                className="group relative px-5 cursor-pointer py-2.5 bg-gradient-to-r from-ui-4 to-blue-500 text-white font-semibold text-sm rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-ui-4/50 overflow-hidden"
              >
                <span className="relative z-10">
                  {translations?.primaryButton}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-ui-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </ModalTrigger>

              <Link
                href="/contact"
                className="group px-5 py-2.5 bg-transparent border border-white/30 backdrop-blur-sm text-white font-semibold text-sm rounded-lg shadow-lg transition-all duration-300 hover:bg-white hover:text-gray-900 hover:border-white hover:scale-105"
              >
                <span className="flex items-center justify-center gap-1.5">
                  {translations?.secondaryButton}
                  <svg
                    className="w-3 h-3 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-6 border-t border-white/10">
              {parseJSON<CountGenericType>(translations?.statistics).map(
                (stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-lg lg:text-2xl font-black text-white mb-1 group-hover:text-ui-4 transition-colors duration-300">
                      {stat.count}
                    </div>
                    <div className="text-white/70 text-xs lg:text-sm font-medium">
                      {stat.title}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-0.5 h-2 bg-white/50 rounded-full mt-1.5 animate-pulse"></div>
          </div>
        </div>
      </section>
      <HeroModal />
    </>
  );
}
