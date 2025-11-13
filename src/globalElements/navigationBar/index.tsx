"use client";
import React from "react";
import Breadcrumb from "../breadcrump";
import { motion } from "framer-motion";
import { MotionParagraph, MotionStrong } from "@/src/lib/motion/motion";
import { stripHtmlTags } from "@/src/lib/domburify";
interface NavigationBarProps {
  title?: string;
  subtitle?: string;
  variant?: "default" | "compact" | "minimal";
  className?: string;
}

export default function NavigationBar({
  title,
  subtitle,
  variant = "default",
  className = "",
}: NavigationBarProps) {
  const heights = {
    default: "min-h-[300px] lg:min-h-[400px]",
    compact: "min-h-[200px] lg:min-h-[300px]",
    minimal: "min-h-[150pc] lg:min-h-[200px]",
  };

  const paddingY = {
    default: "py-15 lg:py-20",
    compact: "py-10 lg:py-16",
    minimal: "py-8 lg:py-12",
  };

  return (
    <section
      className={`relative ${heights[variant]} ${paddingY[variant]}  flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br z-[3] bg-gradient-dark-primary opacity-80"></div>
      <div className="hero-bg-fixed" />

      {/* Main Content */}
      <div className="container relative z-20 px-3 sm:px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Page Title */}
          {title && (
            <MotionStrong
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-dmsans font-black text-white mb-4 leading-tight tracking-tight"
            >
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {title}
              </span>
            </MotionStrong>
          )}

          {/* Subtitle */}
          {subtitle && (
            <MotionParagraph
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base  text-white/90 mb-8 max-w-2xl mx-auto font-light leading-relaxed"
            >
              {stripHtmlTags(subtitle)}
            </MotionParagraph>
          )}

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Breadcrumb
              variant="minimal"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </section>
  );
}
