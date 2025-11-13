import React from "react";

interface CreateButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
}

const CreateButton: React.FC<CreateButtonProps> = ({
  isLoading = false,
  disabled = false,
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      aria-label={isLoading ? "Creating..." : "Create new item"}
      className={`w-full text-white py-2 px-4 rounded-md transition-all duration-200 ease-in-out ${
        isLoading
          ? "bg-blue-300 cursor-wait"
          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
      }`}
    >
      {isLoading ? "Yaradılır..." : "Yarat"}
    </button>
  );
};

export default React.memo(CreateButton);
