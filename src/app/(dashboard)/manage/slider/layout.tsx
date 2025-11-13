"use client";
import React, { Suspense } from "react";
export default function SliderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-white transition-colors duration-300">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            Məlumat yüklənir...
          </p>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
            Zəhmət olmasa gözləyin.
          </p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
