"use client";
import React, { useRef } from "react";
import MySwiper from "@/src/lib/swiper";
import { SwiperSlide } from "swiper/react";
import Icons from "@/public/icons";
import { Swiper as SwiperCore } from "swiper/types";
import ReactFancyBox from "@/src/lib/fancybox";
import YoutubeCards from "@/src/globalElements/cards/youtubeCards";
import { Autoplay } from "swiper/modules";
import { YoutubeItems } from "@/src/services/interface";
interface Props {
  existingData: YoutubeItems[];
}
export default function SliderArea({ existingData }: Props) {
  const swiperRef = useRef<SwiperCore | null>(null);

  const breakpoints = {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  };
  const autoplayOptions = {
    delay: 3500,
    disableOnInteraction: false,
  };
  const keyboard = {
    enabled: true,
    onlyInViewport: false,
  };

  const handleSwiper = (swiper: SwiperCore) => {
    swiperRef.current = swiper;
  };

  const goNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  return (
    <ReactFancyBox className="relative">
      <MySwiper
        modules={[Autoplay]}
        onSwiper={handleSwiper}
        breakpoints={breakpoints}
        spaceBetween={24}
        slideToClickedSlide={true}
        watchSlidesProgress={true}
        centeredSlides={false}
        slidesPerView={3}
        autoplay={autoplayOptions}
        roundLengths={true}
        keyboard={keyboard}
        className="w-full"
        loop={true}
      >
        {existingData?.map((item: any, index: number) => {
          return (
            <SwiperSlide key={item?.id || index} className="h-full">
              <YoutubeCards item={item} />
            </SwiperSlide>
          );
        })}
      </MySwiper>
      {existingData?.length > 3 && (
        <div className="flex items-center justify-center lg:justify-start gap-x-3 mt-8">
          <button
            type="button"
            aria-label="prev button for video slider"
            onClick={goPrev}
            className="w-10 cursor-pointer h-10 flex items-center justify-center rounded-full border border-ui-4 hover:bg-transparent hover:text-ui-4 bg-ui-4 text-ui-2  transition-colors duration-200"
          >
            <Icons.PrevIcons />
          </button>

          <button
            type="button"
            aria-label="prev button for video slider"
            onClick={goNext}
            className="w-10 cursor-pointer h-10 flex items-center justify-center rounded-full border border-ui-4 hover:bg-transparent hover:text-ui-4 bg-ui-4 text-ui-2  transition-colors duration-200"
          >
            <Icons.NextIcons />
          </button>
        </div>
      )}
    </ReactFancyBox>
  );
}
