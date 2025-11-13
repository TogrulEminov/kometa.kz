import React from "react";
interface Props {
  className?: string;
  children: React.ReactNode;
}
export default function FreeQuoteBtn({ className, children }: Props) {
  return (
    <button
      type="button"
      aria-label="free quote btn"
      className={`${className}`}
    >
      {children}
    </button>
  );
}
