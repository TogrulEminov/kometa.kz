"use client";
import { Link, usePathname } from "@/src/i18n/navigation";
import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Icons from "@/public/icons";

type TBreadCrumbProps = {
  className?: string;
  variant?: "default" | "compact" | "minimal";
  showHomeIcon?: boolean;
  showBackButton?: boolean;
  maxItems?: number;
};

// Dynamic route patterns to exclude (slug pages)
const DYNAMIC_ROUTE_PATTERNS = [
  /\/blog\/[^\/]+$/, // /blog/[slug]
  /\/services\/[^\/]+$/, // /services/[slug]
  /\/products\/[^\/]+$/, // /products/[slug]
  /\/news\/[^\/]+$/, // /news/[slug]
  /\/team\/[^\/]+$/, // /team/[slug]
  /\/portfolio\/[^\/]+$/, // /portfolio/[slug]
  /\/case-studies\/[^\/]+$/, // /case-studies/[slug]
];

// Routes that should not show breadcrumbs
const EXCLUDED_ROUTES = ["/", "/login", "/register", "/404", "/500"];

// Valid routes that exist in your routing config
const VALID_ROUTES = [
  "/",
  "/home",
  "/about",
  "/services",
  "/products",
  "/blog",
  "/news",
  "/contact",
  "/team",
  "/portfolio",
  "/case-studies",
];

const Breadcrumb = ({
  className = "",
  variant = "default",
  showHomeIcon = true,
  maxItems = 5,
}: TBreadCrumbProps) => {
  const pathname = usePathname();
  const t = useTranslations();

  // Check if current route should be excluded
  const shouldExclude = React.useMemo(() => {
    // Exclude specific routes
    if (EXCLUDED_ROUTES.includes(pathname)) return true;

    // Exclude dynamic slug routes
    return DYNAMIC_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
  }, [pathname]);

  // Parse path segments
  const pathSegments = React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    // Remove language prefix if exists (az, en, ru)
    const filteredSegments = segments.filter(
      (segment) => !["az", "en", "ru"].includes(segment)
    );

    return filteredSegments;
  }, [pathname]);

  // Generate breadcrumb items with proper type safety
  const breadcrumbItems = React.useMemo(() => {
    const items = pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const isLastItem = index === pathSegments.length - 1;

      // Check if the href is a valid route
      const isValidRoute = VALID_ROUTES.includes(href);

      return {
        href: isValidRoute ? href : "#",
        label: segment,
        isActive: isLastItem,
        isValidRoute,
        translationKey: `pages.${segment.toLowerCase()}`,
      };
    });

    // Limit items if maxItems is set
    if (items.length > maxItems) {
      return [
        ...items.slice(0, 1),
        {
          href: "#",
          label: "...",
          isActive: false,
          isValidRoute: false,
          translationKey: "",
        },
        ...items.slice(-maxItems + 2),
      ];
    }

    return items;
  }, [pathSegments, maxItems]);

  // Don't render if excluded
  if (shouldExclude) return null;

  const containerClasses = {
    default:
      "bg-white/10 backdrop-blur-sm border border-white/20 py-4 rounded-xl max-w-full lg:max-w-fit mx-auto",
    compact:
      "bg-white/5 backdrop-blur-sm border border-white/10 py-3 rounded-lg max-w-full lg:max-w-fit mx-auto",
    minimal:
      "bg-white/5 backdrop-blur-sm py-3 rounded-lg max-w-full lg:max-w-fit mx-auto",
  };

  const breadcrumbClasses = {
    default:
      "flex items-center space-x-1 lg:space-x-3 text-sm max-w-full lg:max-w-fit",
    compact:
      "flex items-center space-x-1 lg:space-x-2 text-xs max-w-full lg:max-w-fit",
    minimal:
      "flex items-center space-x-1 lg:space-x-3  text-sm max-w-full lg:max-w-fit",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${containerClasses[variant]} ${className}`}
      id="customBreadcrumbs"
    >
      <div className="!w-fit mx-auto lg:px-4">
        <nav aria-label="Breadcrumb" className="w-fit mx-auto">
          <ol className={`${breadcrumbClasses[variant]} flex-wrap`}>
            {/* Home Link */}
            <li className="flex-shrink-0">
              <Link
                href={"/" as any}
                className="flex items-center capitalize gap-x-4 text-white hover:text-ui-4 transition-colors"
              >
                {showHomeIcon ? (
                  <>
                    <Icons.Home />
                    <span className="hidden sm:inline">{t("pages.home")}</span>
                  </>
                ) : (
                  t("pages.home")
                )}
              </Link>
            </li>

            {/* Breadcrumb Items */}
            {breadcrumbItems.length > 0 && (
              <>
                <li className="flex-shrink-0 text-white">
                  <Icons.ChevronRight />
                </li>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <li className="min-w-0">
                      {item.label === "..." ? (
                        <span className="text-gray-400">...</span>
                      ) : item.isActive ? (
                        <span className="text-white font-medium truncate block">
                          {item.translationKey && t.has(item.translationKey)
                            ? t(item.translationKey)
                            : item.label}
                        </span>
                      ) : item.isValidRoute ? (
                        <Link
                          href={item.href as any}
                          className="text-white hover:text-ui-4 transition-colors truncate block"
                        >
                          {item.translationKey && t.has(item.translationKey)
                            ? t(item.translationKey)
                            : item.label}
                        </Link>
                      ) : (
                        <span className="text-white truncate block cursor-not-allowed">
                          {item.translationKey && t.has(item.translationKey)
                            ? t(item.translationKey)
                            : item.label}
                        </span>
                      )}
                    </li>
                    {index < breadcrumbItems.length - 1 && (
                      <li className="flex-shrink-0 text-white">
                        <Icons.ChevronRight />
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </ol>
        </nav>
      </div>
    </motion.div>
  );
};

export default Breadcrumb;
