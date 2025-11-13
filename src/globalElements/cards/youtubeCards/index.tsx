"use client";
import { FileType, YoutubeItems } from "@/src/services/interface";
import Link from "next/link";
import React from "react";
import CustomImage from "../../ImageTag";
import { getForCards } from "@/src/utils/getFullimageUrl";
import Icons from "@/public/icons";
import { stripHtmlTags } from "@/src/lib/domburify";

interface Props {
  item: YoutubeItems;
}

export default function YoutubeCards({ item }: Props) {
  const { translations, duration, imageUrl, url, id } = item;
  const { title, description } = translations?.[0];

  return (
    <Link
      href={String(url)}
      data-fancybox={`gallery-${id}`}
      className="group relative block overflow-hidden rounded-2xl transition-all duration-500 aspect-[4/3]"
    >
      <CustomImage
        src={getForCards(imageUrl as FileType)}
        title={title}
        width={400}
        height={300}
        className="w-full h-full object-cover md:transition-all md:duration-700 md:group-hover:blur-sm md:group-hover:scale-110"
      />

      {/* Mobile: static overlay, Desktop: animated overlay */}
      <div className="absolute inset-0 bg-black/60 md:bg-black/40 md:group-hover:bg-black/70 md:transition-all md:duration-500" />

      <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          {duration && (
            <span className="bg-white/10 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
              {duration}
            </span>
          )}

          {/* Mobile: always visible, Desktop: show on hover */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full text-white bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-100 scale-100 md:opacity-0 md:group-hover:opacity-100 md:scale-75 md:group-hover:scale-100 md:transition-all md:duration-500">
            <Icons.Youtube />
          </div>
        </div>

        {/* Mobile: no animation, Desktop: animated */}
        <div className="md:transform md:translate-y-4 md:group-hover:translate-y-0 md:transition-transform md:duration-500">
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-0 md:group-hover:mb-3 line-clamp-2 leading-tight md:transition-all md:duration-500">
            {title}
          </h3>

          {/* Mobile: always visible with fixed height, Desktop: animated height */}
          <div className="md:max-h-0 md:group-hover:max-h-16 md:overflow-hidden md:transition-all md:duration-700 md:ease-out">
            <p className="text-xs md:text-sm text-gray-200 line-clamp-2 leading-relaxed md:pt-1">
              {stripHtmlTags(description)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
