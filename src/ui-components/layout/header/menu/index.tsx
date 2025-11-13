"use client";
import Icons from "@/public/icons";
import { useToggleStore } from "@/src/lib/zustand/useMultiToggleStore";
import React, { useCallback } from "react";

export default function MenuButton() {
  const { toggle } = useToggleStore();
  const handleToggle = useCallback(() => {
    document.body.classList.add("overflow-hidden");
    toggle("main-sidebar");
  }, [toggle]);
  return (
    <button
      type="button"
      aria-label="hamburger button"
      onClick={handleToggle}
      className="cursor-pointer text-ui-4 flex items-center justify-center border border-ui-4 w-10 h-10 rounded-sm lg:hidden"
    >
      <Icons.Menu />
    </button>
  );
}
