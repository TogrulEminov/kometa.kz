import { Certificates, FileType } from "@/src/services/interface";
import React from "react";
import CustomImage from "../../ImageTag";
import { getForCards } from "@/src/utils/getFullimageUrl";
import Link from "next/link";
import { stripHtmlTags } from "@/src/lib/domburify";
interface Props {
  item: Certificates;
}
export default function CertificatesCards({ item }: Props) {
  const { imageUrl, translations, documentId } = item;
  const { title, description } = translations?.[0];
  return (
    <>
      <div className="group bg-white rounded-none shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:rotate-1 overflow-hidden max-w-sm">
        <div className="relative">
          <figure className="relative h-64 overflow-hidden">
            <CustomImage
              width={400}
              height={300}
              title={title}
              className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
              src={getForCards(imageUrl as FileType)}
            />
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wide transform -rotate-3">
              YENİ
            </div>
          </figure>
          <div className="absolute -bottom-6 left-4 right-4">
            <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-ui-4">
              <h3 className="font-bold text-gray-800 text-lg line-clamp-2 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {stripHtmlTags(description)}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-8 pb-4 px-4">
          <Link
            href={getForCards(imageUrl as FileType)}
            data-fancybox={`gallery-${documentId}`}
            className="block w-full bg-ui-1 text-white text-center py-2 rounded-lg hover:bg-ui-4 transition-colors text-sm font-medium"
          >
            ƏTRAFLIYA BAXIN
          </Link>
        </div>
      </div>
    </>
  );
}
