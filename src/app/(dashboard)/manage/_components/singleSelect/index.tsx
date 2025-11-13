import React, { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomAdminSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  title?: string;
  options: SelectOption[];
  error?: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CustomAdminSelect = forwardRef<HTMLSelectElement, CustomAdminSelectProps>(
  ({ title, required, error, placeholder, options, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-2 w-full">
        {title && (
          <span className="text-sm font-medium text-gray-600">
            {title} {required && <sup className="text-red-600">*</sup>}
          </span>
        )}
        <select
          ref={ref}
          required={required}
          className={`w-full p-3 bg-white border rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </label>
    );
  }
);

CustomAdminSelect.displayName = "CustomAdminSelect";

export default CustomAdminSelect;
