"use client";
import React, { useRef, useEffect, ReactNode } from "react";
import { jarallax, jarallaxVideo, JarallaxOptions } from "jarallax";
import "jarallax/dist/jarallax.css";
jarallaxVideo();
interface JarallaxProps extends Partial<JarallaxOptions> {
  className?: string;
  children?: ReactNode;
}

const JarallaxComponent: React.FC<JarallaxProps> = ({
  className = "",
  children,
  ...options
}) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elRef.current;
    if (!element) return;

    jarallax(element, options as JarallaxOptions);

    return () => {
      jarallax(element, "destroy");
    };
  }, [options]);

  return (
    <div ref={elRef} className={`jarallax ${className}`}>
      {children}
    </div>
  );
};

export default JarallaxComponent;
