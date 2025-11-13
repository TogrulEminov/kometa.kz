"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Children,
  isValidElement,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // ✅ AnimatePresence əlavə

// Context
interface TabsContextType {
  activeTab: string;
  setActiveTab: (key: string) => void;
  queryParam: string;
  preserveParams?: string[];
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within QueryTabs");
  }
  return context;
};

// QueryTabs Provider
interface QueryTabsProps {
  children: ReactNode;
  defaultTab?: string;
  queryParam?: string;
  preserveParams?: string[];
  className?: string;
  onChange?: (key: string) => void;
}

export function QueryTabs({
  children,
  defaultTab,
  queryParam = "tab",
  preserveParams = [],
  className = "",
  onChange,
}: QueryTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get tab keys from children
  const tabKeys = Children.toArray(children)
    .filter((child) => isValidElement(child) && child.type === TabItem)
    .map((child) => (child as any).props.value);

  const initialTab = searchParams.get(queryParam) || defaultTab || tabKeys[0];
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Sync with URL
  useEffect(() => {
    const urlTab = searchParams.get(queryParam);
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams, queryParam, activeTab]);

  const handleTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Preserve specified params
    const newParams = new URLSearchParams();
    preserveParams.forEach((param) => {
      const value = params.get(param);
      if (value) newParams.set(param, value);
    });

    newParams.set(queryParam, key);

    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    setActiveTab(key);
    onChange?.(key);
  };

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab: handleTabChange,
        queryParam,
        preserveParams,
      }}
    >
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

// TabItem
interface TabItemProps {
  value: string;
  children: ReactNode;
}

export function TabItem({ value, children }: TabItemProps) {
  return <div data-tab-value={value}>{children}</div>;
}

// TabsList
interface TabsListProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export function TabsList({
  children,
  className = "",
  variant = "default",
}: TabsListProps) {
  const variantStyles = {
    default: "border-b border-gray-200",
    pills: "bg-gray-100 p-1 rounded-lg inline-flex gap-1",
    underline: "border-b-2 border-gray-200",
  };

  return (
    <div className={`flex gap-2 ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}

// TabsTitle
interface TabsTitleProps {
  value: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export function TabsTitle({
  value,
  children,
  className = "",
  icon,
  disabled = false,
}: TabsTitleProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
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

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

// TabsBody - ✅ DÜZƏLDILMIŞ VERSİYA
interface TabsBodyProps {
  value: string;
  children: ReactNode;
  className?: string;
  keepMounted?: boolean;
}
export function TabsBody({
  value,
  children,
  className = "",
}: // keepMounted = false,
TabsBodyProps) {
  const { activeTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <AnimatePresence initial={false}>
      {isActive && (
        <motion.div
          key={value}
          initial={{ opacity: 0, height: 0 }} // ✅ Yığılmış
          animate={{ opacity: 1, height: "auto" }} // ✅ Açılır
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`overflow-hidden ${className}`}
        >
          <div className="pt-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
