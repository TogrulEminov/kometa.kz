"use client";
import React, { useEffect, useState } from "react";
import CustomLink from "next/link";
import Icons from "@/public/icons";
import Logo from "@/src/globalElements/logo";
import { Link, usePathname } from "@/src/i18n/navigation";
import LanguageDropdown from "./language";
import MenuButton from "./menu";
import LinkComponent from "./link/link";
import { useLocale, useTranslations } from "next-intl";
import { useMultiServerQuery } from "@/src/hooks/useServerActions";
import { getSocials } from "@/src/actions/client/social.actions";
import { getContact } from "@/src/actions/client/contact.actions";
import { clearPhoneRegex } from "@/src/lib/domburify";
import { renderSocialIcon } from "@/src/utils/renderSocials";
import Sidebar from "../sidebar";
import { Images, Video } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const [isSticky, setIsSticky] = useState(false);

  const [socialQuery, existingContactQuery] = useMultiServerQuery([
    {
      queryName: "socials",
      actionFn: getSocials,
      config: {
        params: {
          page: 1,
          pageSize: 12,
          status: "published",
        },
        gcTime: 10 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    },
    {
      queryName: "contact",
      actionFn: getContact,
      config: {
        params: {
          locale: "az",
        },
        gcTime: 10 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    },
  ]);

  const socialData = socialQuery?.data?.data;
  const existingContactData = existingContactQuery?.data?.data;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActivePath = (path: string) => {
    const cleanPathname = pathname.replace(`/${locale}`, "") || "/";

    if (path === "/") {
      return cleanPathname === "/";
    }

    return cleanPathname.startsWith(path);
  };

  const isMediaActive =
    isActivePath("/media/video-gallery") ||
    isActivePath("/media/photo-gallery");

  return (
    <>
      <header
        className={`w-full z-[999] fixed top-0 bg-white transition-shadow duration-300 ${
          isSticky ? "shadow-lg" : "shadow-none"
        }`}
      >
        <div
          className={`bg-ui-1 text-gray-300 text-sm hidden lg:block overflow-hidden transition-all duration-500 ease-in-out ${
            isSticky ? "max-h-0 opacity-0 py-0" : "max-h-20 opacity-100 py-2"
          }`}
        >
          <div className="flex items-center justify-between container">
            <div className="flex items-center gap-x-4 xl:gap-x-6">
              {existingContactData?.phone && (
                <CustomLink
                  href={`tel:+${clearPhoneRegex(existingContactData?.phone)}`}
                  className="flex items-center gap-x-2 text-white hover:text-ui-3 transition-colors duration-300"
                >
                  <Icons.Phone />
                  {existingContactData?.phone}
                </CustomLink>
              )}
              {existingContactData?.email && (
                <CustomLink
                  href={`mailto:${existingContactData?.email}`}
                  className="flex items-center gap-x-2 text-white hover:text-ui-3 transition-colors duration-300"
                >
                  <Icons.Mail />
                  {existingContactData?.email}
                </CustomLink>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-x-1">
              {socialData?.map((item, _) => (
                <CustomLink
                  key={item?.documentId}
                  href={item?.socialLink}
                  title={item.socialName}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.socialName}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:text-ui-3 hover:scale-110 transition-all duration-300"
                >
                  {renderSocialIcon(item?.iconName)}
                </CustomLink>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`py-4 transition-all duration-300 ${
            isSticky ? "border-t-0" : "border-t border-gray-100"
          }`}
        >
          <div className="container flex items-center justify-between">
            <Logo isWhite={false} />
            <nav className="items-center gap-x-2 xl:gap-x-4 text-ui-1 font-medium hidden lg:flex">
              <Link
                href={"/" as any}
                className={`relative text-sm xl:text-base px-2 py-2 transition-colors duration-300 group ${
                  isActivePath("/")
                    ? "text-ui-4"
                    : "text-gray-700 hover:text-ui-4"
                }`}
              >
                {t("pages.home")}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-ui-4 transform transition-transform duration-300 origin-left ${
                    isActivePath("/")
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>

              <Link
                href={"/about" as any}
                className={`relative text-sm xl:text-base px-2 py-2 transition-colors duration-300 group ${
                  isActivePath("/about")
                    ? "text-ui-4"
                    : "text-gray-700 hover:text-ui-4"
                }`}
              >
                {t("pages.about")}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-ui-4 transform transition-transform duration-300 origin-left ${
                    isActivePath("/about")
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>

              <Link
                href={"/services" as any}
                className={`relative text-sm xl:text-base px-2 py-2 transition-colors duration-300 group ${
                  isActivePath("/services")
                    ? "text-ui-4"
                    : "text-gray-700 hover:text-ui-4"
                }`}
              >
                {t("pages.services")}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-ui-4 transform transition-transform duration-300 origin-left ${
                    isActivePath("/services")
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>

              <Link
                href={"/certificates" as any}
                className={`relative text-sm xl:text-base px-2 py-2 transition-colors duration-300 group ${
                  isActivePath("/certificates")
                    ? "text-ui-4"
                    : "text-gray-700 hover:text-ui-4"
                }`}
              >
                {t("pages.certificates")}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-ui-4 transform transition-transform duration-300 origin-left ${
                    isActivePath("/certificates")
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>

              {/* Media Dropdown - Pure CSS with Tailwind */}
              <div className="relative group">
                <span
                  className={`relative text-sm xl:text-base px-2 py-2 transition-colors duration-300 flex items-center gap-1 cursor-pointer ${
                    isMediaActive
                      ? "text-ui-4"
                      : "text-gray-700 hover:text-ui-4"
                  }`}
                >
                  {t("pages.media")}
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[2px] bg-ui-4 transform transition-transform duration-300 origin-left ${
                      isMediaActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </span>

                {/* Dropdown Menu */}
                <div
                  className={`
        absolute top-full h-auto z-[999] left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 
        transition-all duration-300 ease-in-out 
         opacity-0 invisible overflow-hidden 
         group-hover:opacity-100 group-hover:visible
    `}
                >
                  <Link
                    href={"/media/video-gallery" as any}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 ${
                      isActivePath("/media/video-gallery")
                        ? "bg-ui-4/10 text-ui-4"
                        : "text-gray-700 hover:bg-gray-50 hover:text-ui-4"
                    }`}
                  >
                    <Video />
                    <span className="font-medium">
                      {t("pages.video-gallery")}
                    </span>
                  </Link>

                  <Link
                    href={"/media/photo-gallery" as any}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 ${
                      isActivePath("/media/photo-gallery")
                        ? "bg-ui-4/10 text-ui-4"
                        : "text-gray-700 hover:bg-gray-50 hover:text-ui-4"
                    }`}
                  >
                    <Images />
                    <span className="font-medium">
                      {t("pages.photo-gallery")}
                    </span>
                  </Link>
                </div>
              </div>
              <Link
                href={"/blog" as any}
                className={`relative text-sm xl:text-base px-2 py-2 transition-colors duration-300 group ${
                  isActivePath("/blog")
                    ? "text-ui-4"
                    : "text-gray-700 hover:text-ui-4"
                }`}
              >
                {t("pages.blog")}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-ui-4 transform transition-transform duration-300 origin-left ${
                    isActivePath("/blog")
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>
            </nav>
            <div className="flex items-center gap-x-2 xl:gap-x-4">
              <LanguageDropdown />
              <LinkComponent />
              <MenuButton />
            </div>
          </div>
        </div>
      </header>
      <Sidebar
        socialData={socialData}
        existingContactData={existingContactData}
      />
    </>
  );
}
