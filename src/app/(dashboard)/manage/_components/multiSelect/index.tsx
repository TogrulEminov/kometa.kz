import { Select } from "antd";
import { FC } from "react";
const AnySelect = Select as any;

interface CustomSelectProps {
  title?: string;
  required?: boolean;
  value: string[]; // multiple seçildiyinə görə value array olmalıdır
  onChange: (value: string[]) => void; // antd-də belə olmalıdır
  options: { value: string | number; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

const CustomMultiSelect: FC<CustomSelectProps> = ({
  title,
  required = false,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
}) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      {title && (
        <span className="text-sm font-medium text-gray-600">
          {title} {required && <sup className="text-red-600">*</sup>}
        </span>
      )}
      <AnySelect
        multiple
        allowClear
        style={{ width: "100%" }}
        placeholder={placeholder}
        showSearch
        optionFilterProp="children"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-3 py-2 bg-white border border-transparent rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {options.map((opt) => (
          <AnySelect.Option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </AnySelect.Option>
        ))}
      </AnySelect>
    </div>
  );
};

export default CustomMultiSelect;
