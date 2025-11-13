import React, { JSX } from "react";
import CustomImage from "../../ImageTag";
import { FileType, TestimonialsItem } from "@/src/services/interface";
import { stripHtmlTags } from "@/src/lib/domburify";
import { getForCards } from "@/src/utils/getFullimageUrl";
import { useTranslations } from "next-intl";

interface Props {
  item: TestimonialsItem;
}

export default function TestimonialsCards({ item }: Props): JSX.Element {
  const { translations, imageUrl, rate, company } = item;
  const { title, description, nameSurname } = translations?.[0] || {};
  const t = useTranslations();
  const renderStars = (rating: number): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <li key={`full-${i}`}>
          <svg
            className="w-4 h-4 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </li>
      );
    }

    // Yarım ulduz
    if (hasHalfStar) {
      stars.push(
        <li key="half">
          <div className="relative">
            <svg
              className="w-4 h-4 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: "50%" }}
            >
              <svg
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </li>
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <li key={`empty-${i}`}>
          <svg
            className="w-4 h-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </li>
      );
    }

    return stars;
  };

  const safeRating = Number(rate) || 0;
  const safeTitle = title || "";
  const safeDescription = description || "";
  const safePersonName = nameSurname || "";
  const safePersonCompanyOrWork = company || "";

  return (
    <div className="bg-ui-10 p-6 h-full space-y-3 rounded-md">
      <div className="rounded-sm w-fit text-yellow-500 text-base bg-white gap-x-3 flex items-center p-2 my-4">
        <ul
          className="flex gap-x-1"
          role="img"
          aria-label={`${safeRating} ulduzdan ${5} ulduz rating`}
        >
          {renderStars(safeRating)}
        </ul>
        <span className="text-ui-1">
          ({safeRating}) {t("star")}
        </span>
      </div>

      <strong className="text-ui-1  font-bold text-lg min-h-14 line-clamp-2 text-ellipsis">
        &quot;{safeTitle}&quot;
      </strong>

      <p className="text-base text-ui-7 font-normal min-h-[120px] text-ellipsis line-clamp-5">
        {stripHtmlTags(safeDescription)}
      </p>

      <div className="flex items-center gap-5">
        <CustomImage
          className="w-15 h-15 rounded-full object-cover"
          width={60}
          height={60}
          title={safePersonName || "User avatar"}
          src={getForCards(imageUrl as FileType)}
        />
        <div className="flex flex-col">
          <strong className="text-ui-1 text-base font-bold">
            {safePersonName}
          </strong>
          <span className="text-sm text-ui-7">{safePersonCompanyOrWork}</span>
        </div>
      </div>
    </div>
  );
}
