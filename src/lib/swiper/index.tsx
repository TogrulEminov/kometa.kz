"use client";
import React, { forwardRef } from "react";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import {
  AutoplayOptions,
  FadeEffectOptions,
  KeyboardOptions,
  NavigationOptions,
  PaginationOptions,
  SwiperModule,
  SwiperOptions,
} from "swiper/types";
import { Swiper as SwiperCore } from "swiper";
import { Swiper, SwiperRef } from "swiper/react";
interface SwiperProps {
  className?: string;
  loop?: boolean;
  modules?: SwiperModule[];
  fadeEffect?: FadeEffectOptions | undefined;
  navigation?: NavigationOptions;
  slidesPerGroup?: number;
  slidesPerGroupSkip?: number;
  slidesPerView?: number | "auto";
  spaceBetween?: string | number;
  speed?: number;
  freeMode?: boolean;
  effect?: string;
  autoplay?: AutoplayOptions | boolean;
  slidesPerGroupAuto?: boolean;
  breakpoints?: {
    [key: number]: SwiperOptions;
  };
  onSwiper?: (swiper: SwiperCore) => void;
  wrapperClass?: string;
  pagination?: PaginationOptions;
  keyboard?: KeyboardOptions;
  centeredSlides?: boolean;
  roundLengths?: boolean;
  slideToClickedSlide?: boolean;
  watchSlidesProgress?: boolean;
  children: React.ReactNode;
  thumbs?: { swiper: SwiperCore | null };
  direction?: "horizontal" | "vertical";
  grabCursor?: boolean;
  onSlideChange?: (swiper: SwiperCore) => void;
}

const MySwiper = forwardRef<SwiperRef, SwiperProps>(
  (
    {
      className,
      loop,
      modules,
      navigation,
      slidesPerGroup,
      fadeEffect,
      slidesPerGroupSkip,
      grabCursor,
      slidesPerView,
      effect = "fade",
      spaceBetween,
      speed,
      slidesPerGroupAuto,
      watchSlidesProgress,
      breakpoints,
      slideToClickedSlide,
      wrapperClass,
      pagination,
      roundLengths,
      keyboard,
      centeredSlides,
      children,
      onSwiper,
      thumbs,
      direction = "horizontal",
      onSlideChange,
      freeMode,
      autoplay,
    },
    ref
  ) => {
    return (
      <Swiper
        suppressHydrationWarning={false}
        className={className}
        loop={loop}
        modules={modules}
        navigation={navigation}
        fadeEffect={fadeEffect}
        slidesPerGroup={slidesPerGroup}
        slidesPerGroupSkip={slidesPerGroupSkip}
        slidesPerView={slidesPerView}
        slideToClickedSlide={slideToClickedSlide}
        roundLengths={roundLengths}
        spaceBetween={spaceBetween}
        freeMode={freeMode}
        grabCursor={grabCursor}
        autoplay={autoplay}
        speed={speed}
        slidesPerGroupAuto={slidesPerGroupAuto}
        breakpoints={breakpoints}
        wrapperClass={wrapperClass}
        watchSlidesProgress={watchSlidesProgress}
        pagination={pagination}
        effect={effect}
        keyboard={keyboard}
        centeredSlides={centeredSlides}
        onSwiper={onSwiper}
        thumbs={thumbs}
        direction={direction}
        onSlideChange={onSlideChange}
        ref={ref}
      >
        {children}
      </Swiper>
    );
  }
);

MySwiper.displayName = "MySwiper";

export default MySwiper;
