"use client";
import React, { useEffect, useRef, useCallback } from "react";
import IMask, { InputMask } from "imask";

interface DynamicPhoneUiProps {
  name: string;
  className?: string;
  placeholder?: string;
  value: string;
  required?: boolean;
  title?: string;
  error?: string;
  onChange: (val: string) => void;
}

const DynamicPhoneAdmin: React.FC<DynamicPhoneUiProps> = ({
  name,
  className,
  placeholder,
  value,
  required,
  onChange,
  title,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<InputMask<any> | null>(null);

  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
    },
    [onChange]
  );

  useEffect(() => {
    if (!inputRef.current) return;

    const phoneMasks = [
      { mask: "+994 00 000 00 00" },
      { mask: "+7 000 000-00-00" },
    ];

    if (maskRef.current) {
      maskRef.current.updateOptions({ mask: phoneMasks });
    } else {
      maskRef.current = IMask(inputRef.current, {
        mask: phoneMasks,
        dispatch: (appended: any, dynamicMasked: any) => {
          const current = (dynamicMasked.value + appended).replace(/\D/g, "");
          if (current.startsWith("994")) {
            return dynamicMasked.compiledMasks[0];
          }
          if (current.startsWith("7")) {
            return dynamicMasked.compiledMasks[1];
          }
          return dynamicMasked.compiledMasks[0];
        },
      });
    }

    if (maskRef.current.value !== value) {
      maskRef.current.value = value;
    }

    maskRef.current.on("accept", () => {
      handleChange(maskRef.current!.value);
    });

    return () => {
      if (maskRef.current) {
        maskRef.current.destroy();
        maskRef.current = null;
      }
    };
  }, [value, handleChange]);

  return (
    <label htmlFor={name} className={`flex flex-col gap-2 w-full ${className}`}>
      {title && (
        <span className="text-sm font-medium text-gray-600">
          {title} {required && <sup className="text-red-600">*</sup>}
        </span>
      )}
      <input
        ref={inputRef}
        name={name}
        className={`w-full p-3 bg-white border rounded-md focus:outline-none  focus:border-ui-4 focus:ring-1 focus:ring-ui-4 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder || "+994 00 000 00 00"}
        type="tel"
        autoComplete="off"
        value={value}
        required={required}
        onChange={(e) => handleChange(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </label>
  );
};

export default React.memo(DynamicPhoneAdmin);
