"use client";
import React, { useRef } from "react";
import MySwiper from "@/src/lib/swiper";
import { SwiperSlide } from "swiper/react";
import ServicesCard from "@/src/globalElements/cards/services";
import Icons from "@/public/icons";
import { Autoplay } from "swiper/modules";
import { Swiper as SwiperCore } from "swiper/types";
import { ServicesItem } from "@/src/services/interface";
interface Props {
  serviceData: ServicesItem[];
}
export default function SliderArea({ serviceData }: Props) {
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
    <div className="relative">
      <MySwiper
        modules={[Autoplay]}
        onSwiper={handleSwiper}
        breakpoints={breakpoints}
        spaceBetween={24}
        slideToClickedSlide={false}
        watchSlidesProgress={false}
        centeredSlides={false}
        slidesPerView={3}
        autoplay={autoplayOptions}
        roundLengths={true}
        keyboard={keyboard}
        className="w-full lg:min-w-[100vw]"
        loop={true}
      >
        {serviceData?.map((item: any, index: number) => {
          return (
            <SwiperSlide key={item?.id || index} className="h-full">
              <ServicesCard item={item} />
            </SwiperSlide>
          );
        })}
      </MySwiper>
      {serviceData?.length > 3 && (
        <div className="flex items-center gap-x-3 mt-8 justify-center lg:justify-start">
          <button
            type="button"
            aria-label="prev button for services slider"
            onClick={goPrev}
            className="w-10 cursor-pointer h-10 flex items-center justify-center rounded-full border border-ui-4 hover:bg-transparent hover:text-ui-4 bg-ui-4 text-ui-2  transition-colors duration-200"
          >
            <Icons.PrevIcons />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="next button for services slider"
            className="w-10 cursor-pointer h-10 flex items-center justify-center rounded-full border border-ui-4 hover:bg-transparent hover:text-ui-4 bg-ui-4 text-ui-2  transition-colors duration-200"
          >
            <Icons.NextIcons />
          </button>
        </div>
      )}
    </div>
  );
}
