"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";

// Context
interface MultiTabsContextType {
  activeTabs: Record<string, string>;
  setActiveTab: (group: string, value: string) => void;
}

const MultiTabsContext = createContext<MultiTabsContextType | undefined>(
  undefined
);

const useMultiTabs = (group: string) => {
  const context = useContext(MultiTabsContext);
  if (!context) {
    throw new Error("MultiTabs components must be used within MultiQueryTabs");
  }
  return {
    activeTab: context.activeTabs[group] || "",
    setActiveTab: (value: string) => context.setActiveTab(group, value),
  };
};

// ============================================
// 🎯 MULTI QUERY TABS - YENİ ADLAR
// ============================================

// MultiQueryTabs Provider
interface MultiQueryTabsProps {
  children: ReactNode;
  defaultTabs?: Record<string, string>;
  preserveParams?: string[];
  className?: string;
  onChange?: (allTabs: Record<string, string>) => void;
}

export function MultiQueryTabs({
  children,
  defaultTabs = {},
  preserveParams = [],
  className = "",
  onChange,
}: MultiQueryTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTabs, setActiveTabs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = { ...defaultTabs };
    searchParams.forEach((value, key) => {
      if (!preserveParams.includes(key)) {
        initial[key] = value;
      }
    });
    return initial;
  });

  useEffect(() => {
    const newTabs: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (!preserveParams.includes(key)) {
        newTabs[key] = value;
      }
    });
    if (JSON.stringify(newTabs) !== JSON.stringify(activeTabs)) {
      setActiveTabs((prev) => ({ ...prev, ...newTabs }));
    }
  }, [searchParams]);

  const setActiveTab = (group: string, value: string) => {
    const newTabs = { ...activeTabs, [group]: value };
    setActiveTabs(newTabs);

    const params = new URLSearchParams();
    preserveParams.forEach((param) => {
      const val = searchParams.get(param);
      if (val) params.set(param, val);
    });
    Object.entries(newTabs).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    onChange?.(newTabs);
  };

  return (
    <MultiTabsContext.Provider value={{ activeTabs, setActiveTab }}>
      <div className={`w-full ${className}`}>{children}</div>
    </MultiTabsContext.Provider>
  );
}

// MultiTabGroup (əvvəlki TabGroup)
interface MultiTabGroupProps {
  group: string;
  children: ReactNode;
  className?: string;
}

export function MultiTabGroup({
  group,
  children,
  className = "",
}: MultiTabGroupProps) {
  return (
    <div data-multi-tab-group={group} className={className}>
      {children}
    </div>
  );
}

// MultiTabsList (əvvəlki TabsList)
interface MultiTabsListProps {
  group: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export function MultiTabsList({
  group,
  children,
  className = "",
  variant = "default",
}: MultiTabsListProps) {
  const variantStyles = {
    default: "border-b border-gray-200",
    pills: "bg-gray-100 p-1 rounded-lg inline-flex gap-1",
    underline: "border-b-2 border-gray-200",
  };

  return (
    <div
      data-multi-tabs-list={group}
      className={`flex gap-2 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

// MultiTabsTitle (əvvəlki TabsTitle)
interface MultiTabsTitleProps {
  group: string;
  value: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export function MultiTabsTitle({
  group,
  value,
  children,
  className = "",
  icon,
  disabled = false,
}: MultiTabsTitleProps) {
  const { activeTab, setActiveTab } = useMultiTabs(group);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      data-active={isActive}
      className={`
        relative px-4 py-2 font-medium transition-all duration-200
        ${isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      <span className="flex items-center gap-2">
        {icon}
        {children}
      </span>

      {isActive && (
        <motion.div
          layoutId={`activeTab-${group}`}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

// MultiTabsBody (əvvəlki TabsBody)
interface MultiTabsBodyProps {
  group: string;
  value: string;
  children: ReactNode;
  className?: string;
  keepMounted?: boolean;
}

export function MultiTabsBody({
  group,
  value,
  children,
  className = "",
  keepMounted = false,
}: MultiTabsBodyProps) {
  const { activeTab } = useMultiTabs(group);
  const isActive = activeTab === value;

  if (!isActive && !keepMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
      transition={{ duration: 0.2 }}
      className={`pt-4 ${!isActive && "hidden"} ${className}`}
    >
      {children}
    </motion.div>
  );
}
