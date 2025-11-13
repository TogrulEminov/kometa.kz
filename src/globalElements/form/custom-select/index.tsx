"use client";
import React from "react";
import Select, { DefaultOptionType } from "antd/es/select";
import ConfigProvider from "antd/es/config-provider";

interface CustomAdminSelectProps {
  title?: string;
  error?: string;
  value?: any;
  name?: string;
  required?: boolean;
  placeholder?: string;
  options: DefaultOptionType[];
  onChange?: (value: any) => void;
  className?: string;
  mode?: "multiple" | "tags";
}

const CustomAdminAntSelect: React.FC<CustomAdminSelectProps> = ({
  title,
  required,
  error,
  placeholder,
  options,
  value,
  onChange,
  className,
  mode,
  ...props
}) => {
  return (
    <label className={`flex flex-col gap-2 w-full ${className}`}>
      {title && (
        <span className="text-sm font-medium text-gray-600">
          {title} {required && <sup className="text-red-600">*</sup>}
        </span>
      )}
      <ConfigProvider
        theme={{
          components: {
            Select: {
              colorBorder: error ? "#ef4444" : "#d1d5db",
              colorPrimaryHover: "#3b82f6",
              controlOutline: "rgba(59, 130, 246, 0.1)",
              colorBgContainer: "#ffffff",
              colorText: "#111827",
              colorTextPlaceholder: "#9ca3af",
              colorBgElevated: "#ffffff",
              optionSelectedBg: "#eff6ff",
              optionActiveBg: "#f3f4f6",
              colorPrimary: "#3b82f6",
              fontSizeLG: 14,
              controlHeightLG: 48,
            },
          },
        }}
      >
        <Select
          value={value || undefined}
          placeholder={placeholder}
          options={options}
          onChange={onChange}
          allowClear={true}
          mode={mode}
          size="large"
          className={`w-full ${error ? "border-red-500" : ""}`}
          style={{
            width: "100%",
          }}
          {...props}
        />
      </ConfigProvider>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </label>
  );
};

export default CustomAdminAntSelect;
