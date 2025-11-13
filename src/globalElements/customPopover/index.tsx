"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
  CSSProperties,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePopoverStore } from "@/src/hooks/usePopoverStore";

// Popover Context
interface PopoverContextType {
  id: string;
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  placement?: "top" | "bottom" | "left" | "right";
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

const usePopover = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within PopoverProvider");
  }
  return context;
};

// PopoverProvider
interface PopoverProviderProps {
  id: string;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function PopoverProvider({
  id,
  children,
  placement = "bottom",
  className = "",
}: PopoverProviderProps) {
  const {
    isOpen: checkIsOpen,
    togglePopover,
    openPopover,
    closePopover,
  } = usePopoverStore();
  const isOpen = checkIsOpen(id);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        closePopover(id);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, id, closePopover]);

  return (
    <PopoverContext.Provider
      value={{
        id,
        isOpen,
        toggle: () => togglePopover(id),
        open: () => openPopover(id),
        close: () => closePopover(id),
        placement,
      }}
    >
      <div ref={popoverRef} className={`relative inline-block ${className}`}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

// PopoverTrigger
interface PopoverTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

export function PopoverTrigger({
  children,
  asChild = false,
  className = "",
}: PopoverTriggerProps) {
  const { toggle } = usePopover();

  if (asChild) {
    // Clone child element and add onClick
    const child = children as React.ReactElement;
    return <div onClick={toggle}>{child}</div>;
  }

  return (
    <button
      onClick={toggle}
      className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-150  hover:scale-95 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

// PopoverContent
interface PopoverContentProps {
  children: ReactNode;
  className?: string;
  arrow?: boolean;
  style?: CSSProperties;
}

export function PopoverContent({
  children,
  className = "",
  arrow = true,
  style,
}: PopoverContentProps) {
  const { isOpen, placement } = usePopover();

  const placementStyles: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowStyles: Record<string, string> = {
    top: "top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45",
    bottom: "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45",
    left: "left-full top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45",
    right: "right-full top-1/2 translate-x-1/2 -translate-y-1/2 rotate-45",
  };

  const animations = {
    top: {
      initial: { y: 10, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 10, opacity: 0 },
    },
    bottom: {
      initial: { y: -10, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -10, opacity: 0 },
    },
    left: {
      initial: { x: 10, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 10, opacity: 0 },
    },
    right: {
      initial: { x: -10, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -10, opacity: 0 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...animations[placement || "bottom"]}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`absolute ${
            placementStyles[placement || "bottom"]
          } z-50 ${className}`}
          style={style}
        >
          {/* Arrow */}
          {arrow && (
            <div
              className={`absolute w-3 h-3 -z-1 bg-white border border-gray-100 ${
                arrowStyles[placement || "bottom"]
              }`}
            />
          )}

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 min-w-[200px]">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// PopoverClose (optional close button)
interface PopoverCloseProps {
  children?: ReactNode;
  className?: string;
}

export function PopoverClose({ children, className = "" }: PopoverCloseProps) {
  const { close } = usePopover();

  return (
    <button
      onClick={close}
      className={`text-gray-500 hover:text-gray-700 transition-colors ${className}`}
    >
      {children || "✕"}
    </button>
  );
}
