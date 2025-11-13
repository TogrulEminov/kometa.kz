"use client";
import { FileType, GalleryItem } from "@/src/services/interface";
import Link from "next/link";
import React from "react";
import CustomImage from "../../ImageTag";
import { getForCards } from "@/src/utils/getFullimageUrl";

interface Props {
  item: GalleryItem;
}

export default function PhotoGalleryCard({ item }: Props) {
  const { translations, imageUrl, gallery, id } = item;
  const { title } = translations?.[0] || {};

  const galleryCount = gallery?.length || 0;

  return (
    <div className="group relative">
      {/* Main Card */}
      <Link
        href={getForCards(imageUrl as FileType)}
        data-fancybox={`gallery-${id}`}
        data-caption={title}
        className="relative block overflow-hidden rounded-2xl transition-all duration-500 aspect-[4/3] shadow-lg hover:shadow-2xl"
      >
        <CustomImage
          src={getForCards(imageUrl as FileType)}
          title={title}
          width={400}
          height={300}
          className="w-full h-full object-cover md:transition-all md:duration-700 md:group-hover:blur-sm md:group-hover:scale-110"
        />

        {/* Mobile: static overlay, Desktop: animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:from-black/60 md:via-black/30 md:group-hover:from-black/90 md:group-hover:via-black/60 md:transition-all md:duration-500" />

        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            {galleryCount > 0 && (
              <span className="bg-white/10 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {galleryCount + 1} şəkil
              </span>
            )}

            {/* Mobile: always visible, Desktop: show on hover */}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full text-white bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-100 scale-100 md:opacity-0 md:group-hover:opacity-100 md:scale-75 md:group-hover:scale-100 md:transition-all md:duration-500">
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>

          {/* Mobile: no animation, Desktop: animated */}
          <div className="md:transform md:translate-y-4 md:group-hover:translate-y-0 md:transition-transform md:duration-500">
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-0 md:group-hover:mb-3 line-clamp-2 leading-tight md:transition-all md:duration-500">
              {title}
            </h3>
          </div>
        </div>
      </Link>

      {/* Hidden Gallery Images for Fancybox */}
      <div className="hidden">
        {gallery?.map((image, index) => (
          <a
            key={image.id}
            href={getForCards(image as FileType)}
            data-fancybox={`gallery-${id}`}
            data-caption={`${title} - Şəkil ${index + 2}`}
          >
            Hidden Image {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
}
