"use client";
import { useRef, useEffect, ReactNode } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

interface ReactFancyBoxProps {
  children: ReactNode;
  delegate?: string;
  options?: Record<string, unknown>;
  className?: string;
}

const ReactFancyBox = ({
  children,
  className,
  delegate = "[data-fancybox]",
  options = {},
}: ReactFancyBoxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Merge options with Thumbs default
    const fancyboxOptions = {
      ...options,
      Thumbs: options?.Thumbs !== undefined ? options.Thumbs : true,
    };

    NativeFancybox.bind(container, delegate, fancyboxOptions as object);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  }, [delegate, options]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default ReactFancyBox;
