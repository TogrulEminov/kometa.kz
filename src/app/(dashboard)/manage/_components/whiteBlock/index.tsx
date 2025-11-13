"use client";
import { useToggleState } from "@/src/lib/zustand/useMultiToggleStore";
import React from "react";

const WhiteBlock = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isSidebarOpen = useToggleState("admin-sidebar");

  return (
    <div
      className={`min-h-screen p-8 mt-5 rounded-lg mr-4  bg-white ease-in-out ${
        isSidebarOpen ? "ml-4" : "ml-[276px]"
      }`}
    >
      {children}
    </div>
  );
};

export default React.memo(WhiteBlock);
