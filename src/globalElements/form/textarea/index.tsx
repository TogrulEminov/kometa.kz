import React, { forwardRef } from "react";

interface CustomTextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  title?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CustomUiTextarea = forwardRef<HTMLTextAreaElement, CustomTextAreaProps>(
  ({ title, required, error, placeholder, rows = 4, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-2 w-full">
        {title && (
          <span className="text-sm font-medium text-gray-600">
            {title} {required && <sup className="text-red-600">*</sup>}
          </span>
        )}
        <textarea
          ref={ref}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`w-full p-3 bg-white border rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed resize-y ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </label>
    );
  }
);

CustomUiTextarea.displayName = "CustomUiTextarea";

export default CustomUiTextarea;
