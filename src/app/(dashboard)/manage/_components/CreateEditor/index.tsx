"use client";
import React, { useRef, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
import { FC } from "react";

// Define the interface for props
interface CustomEditorProps {
  title?: string;
  required?: boolean;
  placeholder?: string;
  name?: string;
  error?: string;
  value?: string | undefined;
  onChange?: (value: string) => void;
}

const CustomAdminEditor: FC<CustomEditorProps> = ({
  title,
  required,
  placeholder,
  name,
  error,
  value,
  onChange,
}) => {
  const editor = useRef<null>(null);

  const config = useMemo(
    () => ({
      readonly: false,
      removeButtons: ["file"],
      buttons: [
        "source",
        "|",
        "brush",
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "table",
        "link",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
      ],
      style: {
        background: "#f5f5f5",
        color: "#262626",
        focus: "#2a85ff",
      },
      enterMode: 1,
      shiftEnterMode: 1,
      useSingleLine: false,
      addNewLine: false,
      placeholder: placeholder || "Start typing...",
      events: {
        afterInit: (editorInstance: any) => {
          const originalLinkCommand = editorInstance.createLink;

          editorInstance.createLink = (url: string) => {
            const link = originalLinkCommand.call(editorInstance, url);
            if (link) {
              link.target = "_blank";
              link.rel = "nofollow";
            }
            return link;
          };
          editorInstance.events.on("change", () => {
            const links = editorInstance.container.querySelectorAll("a");
            links.forEach((link: HTMLAnchorElement) => {
              if (!link.target) {
                link.target = "_blank";
              }
              if (!link.rel) {
                link.rel = "nofollow";
              }
            });
          });
        },
      },
    }),
    [placeholder]
  );

  const handleChange = useCallback(
    (value: string) => {
      if (onChange) onChange(value);
    },
    [onChange]
  );

  return (
    <label htmlFor={name} className="flex flex-col gap-4 w-full">
      {title && (
        <span className="text-sm font-medium text-gray-600">
          {title} {required && <sup className="text-red-600">*</sup>}
        </span>
      )}
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        tabIndex={1}
        className={`bg-white min-h-[200px] text-gray-900 text-sm font-normal font-poppins ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        onBlur={handleChange}
        onChange={handleChange}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </label>
  );
};

export default React.memo(CustomAdminEditor);
