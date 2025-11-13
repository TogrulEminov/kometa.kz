"use client";
import React from "react";
const FieldBlock = ({
  title,
  children,
}: Readonly<{
  children: React.ReactNode;
  title?: string;
}>) => {
  return (
    <div
      className={`p-5 rounded-[20px] bg-[#f5f5f5] border border-[#ddd] ease-in-out flex flex-col space-y-6`}
    >
      <h3 className="text-base text-black font-medium">{title}</h3>
      {children}
    </div>
  );
};
export default React.memo(FieldBlock);
