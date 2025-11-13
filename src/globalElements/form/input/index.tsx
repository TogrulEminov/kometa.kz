import React, { forwardRef } from "react";

interface CustomUiInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  title?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomUiInput = forwardRef<HTMLInputElement, CustomUiInputProps>(
  ({ title, required, error, type = "text", placeholder, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-2 w-full">
        {title && (
          <span className="text-sm font-medium text-gray-600">
            {title} {required && <sup className="text-red-600">*</sup>}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          required={required}
          className={`w-full p-3 bg-white border rounded-md focus:outline-none focus:border-ui-4 focus:ring-1 focus:ring-ui-4 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </label>
    );
  }
);

CustomUiInput.displayName = "CustomUiInput";

export default CustomUiInput;
