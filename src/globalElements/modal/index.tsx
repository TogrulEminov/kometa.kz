"use client";
import {
  useToggleState,
  useToggleStore,
} from "@/src/lib/zustand/useMultiToggleStore";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface GlobalModalProps {
  modalKey: string;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "center" | "top" | "bottom";
  animation?: "fade" | "scale" | "slide" | "slideUp" | "slideDown";
}

// Animation variants
const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  slide: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  },
  slideUp: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
  },
  slideDown: {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
  },
};

// Size classes - hündürlük məhdudiyyəti əlavə edildi
const sizeClasses = {
  sm: "max-w-sm w-full max-h-[90vh]",
  md: "max-w-md w-full max-h-[90vh]",
  lg: "max-w-lg w-full max-h-[90vh]",
  xl: "max-w-xl w-full max-h-[90vh]",
  full: "w-[95vw] h-[95vh] max-w-none max-h-none",
};

// Position classes - padding əlavə edildi
const positionClasses = {
  center: "items-center justify-center p-4",
  top: "items-start justify-center pt-8 p-4",
  bottom: "items-end justify-center pb-8 p-4",
};

export default function GlobalModal({
  modalKey,
  children,
  className = "",
  overlayClassName = "",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = "md",
  position = "center",
  animation = "scale",
}: GlobalModalProps) {
  const isOpen = useToggleState(modalKey);
  const { close } = useToggleStore();

  // Close on escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close(modalKey);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, close, modalKey]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      close(modalKey);
    }
  };

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-[999] flex ${positionClasses[position]} ${overlayClassName}`}
          onClick={handleOverlayClick}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            variants={animationVariants[animation]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className={`relative z-10 ${sizeClasses[size]} bg-white  rounded-lg shadow-xl overflow-hidden flex flex-col ${className}`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render in portal for better z-index management
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
}

// Modal Header Component
interface ModalHeaderProps {
  children: ReactNode;
  modalKey: string;
  showCloseButton?: boolean;
  className?: string;
}

export function ModalHeader({
  children,
  modalKey,
  showCloseButton = true,
  className = "",
}: ModalHeaderProps) {
  const { close } = useToggleStore();

  return (
    <div
      className={`flex items-center justify-center p-6 border-b border-gray-200  flex-shrink-0 ${className}`}
    >
      <div className="text-lg font-semibold text-ui-1 ">{children}</div>
      {showCloseButton && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => close(modalKey)}
          className="p-1 rounded-full hover:bg-gray-100 cursor-pointer absolute top-5 right-5  transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-500 "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      )}
    </div>
  );
}

// Modal Body Component - scroll funksiyası əlavə edildi
interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export function ModalBody({ children, className = "" }: ModalBodyProps) {
  return (
    <div
      className={`p-6 flex-1 overflow-y-auto scrollbar-color scrollbar-thin ${className}`}
    >
      {children}
    </div>
  );
}

// Modal Footer Component
interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return (
    <div
      className={`flex items-center justify-end gap-3 p-6 border-t border-gray-200  flex-shrink-0 ${className}`}
    >
      {children}
    </div>
  );
}

// Modal Trigger Component
interface ModalTriggerProps {
  modalKey: string;
  children: ReactNode;
  className?: string;
  asChild?: boolean;
}

export function ModalTrigger({
  modalKey,
  children,
  className = "",
  asChild = false,
}: ModalTriggerProps) {
  const { open } = useToggleStore();

  if (asChild) {
    // Clone the child element and add onClick
    return <div onClick={() => open(modalKey)}>{children}</div>;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => open(modalKey)}
      className={`px-4 py-2 cursor-pointer bg-ui-4 text-white rounded-lg hover:bg-ui-11 transition-colors ${className}`}
    >
      {children}
    </motion.button>
  );
}
