"use client";
import React from "react";
import { motion } from "framer-motion";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

interface MotionCheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  onChange: (e: CheckboxChangeEvent) => void;
  isDisabled?: boolean;
}

const MotionCheckbox: React.FC<MotionCheckboxProps> = ({
  checked,
  indeterminate,
  onChange,
  isDisabled,
}) => {
  const handleNativeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      target: { checked: e.target.checked },
    } as CheckboxChangeEvent);
  };

  return (
    <motion.div
      className={"inline-block mr-2.5 ease-in-out "}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <input
        type="checkbox"
        disabled={isDisabled}
        checked={checked}
        onChange={handleNativeInputChange}
        className={
          "w-5 h-5 border border-[#ddd] rounded-sm accent-blue-700 cursor-pointer hover:scale-105 checked:accent-blue-900"
        }
        ref={(input) => {
          if (input) {
            input.indeterminate = indeterminate;
          }
        }}
      />
    </motion.div>
  );
};

export default MotionCheckbox;
