"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icons from "@/public/icons";

// Types
interface AccordionItem {
  id: string;
  [key: string]: unknown;
}

interface AccordionContextType {
  activeIds: string[];
  toggleItem: (id: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      "Accordion components must be used within AccordionProvider"
    );
  }
  return context;
};

// AccordionProvider
interface AccordionProviderProps {
  children: ReactNode;
  type?: "single" | "multiple";
  defaultOpen?: string | string[];
  className?: string;
}

export function AccordionProvider({
  children,
  type = "single",
  defaultOpen,
  className = "",
}: AccordionProviderProps) {
  const [activeIds, setActiveIds] = useState<string[]>(() => {
    if (!defaultOpen) return [];
    return Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen];
  });

  const toggleItem = (id: string) => {
    setActiveIds((prev) => {
      if (type === "single") {
        // Single mode: yalnız bir item açıq ola bilər
        return prev.includes(id) ? [] : [id];
      } else {
        // Multiple mode: bir neçə item açıq ola bilər
        return prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id];
      }
    });
  };

  return (
    <AccordionContext.Provider value={{ activeIds, toggleItem, type }}>
      <div className={`w-full space-y-3 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
}

// AccordionItem Context
interface AccordionItemContextType {
  id: string;
  isOpen: boolean;
}

const AccordionItemContext = createContext<
  AccordionItemContextType | undefined
>(undefined);

const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("AccordionHead/Body must be used within AccordionItem");
  }
  return context;
};

// AccordionItem
interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({
  id,
  children,
  className = "",
}: AccordionItemProps) {
  const { activeIds } = useAccordionContext();
  const isOpen = activeIds.includes(id);

  return (
    <AccordionItemContext.Provider value={{ id, isOpen }}>
      <div
        className={`border border-gray-200 rounded-lg overflow-hidden bg-white  hover:shadow-md transition-all ${className}`}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

// AccordionHead
interface AccordionHeadProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function AccordionHead({
  children,
  className = "",
  icon,
}: AccordionHeadProps) {
  const { id, isOpen } = useAccordionItem();
  const { toggleItem } = useAccordionContext();

  return (
    <button
      type="button"
      onClick={() => toggleItem(id)}
      className={`w-full px-6 py-4 flex items-center cursor-pointer justify-between text-left hover:bg-gray-50 transition-colors ${className}`}
    >
      <span className="font-semibold text-lg text-gray-800">{children}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {icon || <Icons.ArrowDown className="w-5 h-5 text-gray-600" />}
      </motion.div>
    </button>
  );
}

// AccordionBody
interface AccordionBodyProps {
  children: ReactNode;
  className?: string;
}

export function AccordionBody({
  children,
  className = "",
}: AccordionBodyProps) {
  const { isOpen } = useAccordionItem();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div
            className={`px-6 pb-4 pt-2 text-gray-600 border-t border-gray-100 ${className}`}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
