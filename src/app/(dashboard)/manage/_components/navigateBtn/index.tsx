"use client";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

const NavigateBtn = () => {
  const router = useRouter();
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <button
      type="button"
      onClick={handleBack}
      className="w-full cursor-pointer bg-red-600 text-white py-2 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-red-700"
    >
      Geri dön
    </button>
  );
};

export default React.memo(NavigateBtn);
