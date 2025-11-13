import React from "react";
import CustomImage from "@/src/globalElements/ImageTag";
import { StaticImageData } from "next/image";
import { Tag } from "lucide-react";

interface Props {
  documentId: string;
  title: string;
  id: number;
  imageUrl?: string | StaticImageData;
}

export default function TableImageTitle({
  documentId,
  title,
  id,
  imageUrl,
}: Props) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors max-w-md">
      {imageUrl && (
        <div className="relative flex-shrink-0">
          <CustomImage
            src={imageUrl}
            width={64}
            height={64}
            title={title}
            className="rounded-lg w-16 h-16 object-cover shadow-md"
          />
          <span className="hidden">{id}</span>
        </div>
      )}
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
          {title}
        </h3>
        {documentId && (
          <div className="flex items-center gap-1.5 text-xs">
            <Tag className="w-3 h-3 text-gray-400" />
            <code className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-mono text-xs">
              {documentId.slice(0, 8)}
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
