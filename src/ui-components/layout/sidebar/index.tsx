"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  useToggleState,
  useToggleStore,
} from "@/src/lib/zustand/useMultiToggleStore";
import { Link, usePathname } from "@/src/i18n/navigation";
import { MotionDiv, MotionNav } from "@/src/lib/motion/motion";
import { AnimatePresence } from "framer-motion";
import Logo from "@/src/globalElements/logo";
import Icons from "@/public/icons";
import { useTranslations } from "next-intl";
import CustomLink from "next/link";
import { ContactInfo, Social } from "@/src/services/interface";
import { renderSocialIcon } from "@/src/utils/renderSocials";
import { clearPhoneRegex } from "@/src/lib/domburify";

interface Props {
  socialData?: Social[];
  existingContactData?: ContactInfo;
}

export default function Sidebar({ existingContactData, socialData }: Props) {
  const { close } = useToggleStore();
  const isSidebarOpen = useToggleState("main-sidebar");
  const [isMediaOpen, setIsMediaOpen] = useState(false);

  const pathname = usePathname();
  const t = useTranslations();

  const handleClose = useCallback(() => {
    document.body.classList.remove("overflow-hidden");
    close("main-sidebar");
    setIsMediaOpen(false);
  }, [close]);

  useEffect(() => {
    if (pathname) {
      handleClose();
    }
  }, [pathname, handleClose]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        handleClose();
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleClose]);

  const isMediaActive =
    pathname.startsWith("/video-gallery") ||
    pathname.startsWith("/photo-gallery");

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <MotionNav
            initial={{ x: "100%", opacity: 0 }}
            exit={{ x: "100%", opacity: 0 }}
            animate={{
              x: isSidebarOpen ? "0%" : "200%",
              opacity: isSidebarOpen ? 1 : 0,
            }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
            className="fixed select-none top-0 h-svh overflow-y-auto flex flex-col w-full h-svhs bg-ui-3 z-[999]"
          >
            <div className="flex items-center p-4 justify-between">
              <Logo />
              <button
                onClick={handleClose}
                type="button"
                className="cursor-pointer"
              >
                <Icons.Close fill="#000" width={25} height={25} />
              </button>
            </div>
            <ul className="py-4">
              <li className="p-2 px-4 bg-transparent transition-colors hover:bg-white">
                <Link
                  href={"/" as any}
                  className="py-2 flex items-center font-montserrat text-sm font-medium justify-between"
                >
                  {t("pages.home")} <Icons.ArrowRotate />
                </Link>
              </li>
              <li
                className={`p-2 px-4 bg-transparent transition-colors hover:bg-white ${
                  pathname.startsWith("/about") ? "bg-white" : ""
                }`}
              >
                <Link
                  href={"/about"}
                  className="py-2 flex items-center font-montserrat text-sm font-medium justify-between"
                >
                  {t("pages.about")}
                  <Icons.ArrowRotate />
                </Link>
              </li>
              <li
                className={`p-2 px-4 bg-transparent transition-colors hover:bg-white ${
                  pathname.startsWith("/services") ? "bg-white" : ""
                }`}
              >
                <Link
                  href={"/services"}
                  className="py-2 flex items-center font-montserrat text-sm font-medium justify-between"
                >
                  {t("pages.services")} <Icons.ArrowRotate />
                </Link>
              </li>
              <li
                className={`p-2 px-4 bg-transparent transition-colors hover:bg-white ${
                  pathname.startsWith("/certificates") ? "bg-white" : ""
                }`}
              >
                <Link
                  href={"/certificates"}
                  className="py-2 flex items-center font-montserrat text-sm font-medium justify-between"
                >
                  {t("pages.certificates")}
                  <Icons.ArrowRotate />
                </Link>
              </li>

              {/* Media Dropdown */}
              <li
                className={`bg-transparent transition-colors ${
                  isMediaActive ? "bg-white" : ""
                }`}
              >
                <button
                  onClick={() => setIsMediaOpen(!isMediaOpen)}
                  className="w-full p-2 px-4 py-2 flex items-center font-montserrat text-sm font-medium justify-between hover:bg-white transition-colors"
                >
                  {t("pages.media")}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMediaOpen ? "rotate-180" : ""
                    }`}
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
                </button>

                {/* Dropdown Content */}
                <AnimatePresence>
                  {isMediaOpen && (
                    <MotionDiv
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-ui-2"
                    >
                      <ul className="py-2">
                        <li
                          className={`pl-8 pr-4 py-2 transition-colors hover:bg-white ${
                            pathname.startsWith("/media/video-gallery")
                              ? "bg-white"
                              : ""
                          }`}
                        >
                          <Link
                            href={"/media/video-gallery"}
                            className="flex items-center font-montserrat text-sm font-normal justify-between"
                          >
                            <span className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                              </svg>
                              {t("pages.video-gallery")}
                            </span>
                            <Icons.ArrowRotate />
                          </Link>
                        </li>
                        <li
                          className={`pl-8 pr-4 py-2 transition-colors hover:bg-white ${
                            pathname.startsWith("/media/photo-gallery")
                              ? "bg-white"
                              : ""
                          }`}
                        >
                          <Link
                            href={"/media/photo-gallery"}
                            className="flex items-center font-montserrat text-sm font-normal justify-between"
                          >
                            <span className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {t("pages.photo-gallery")}
                            </span>
                            <Icons.ArrowRotate />
                          </Link>
                        </li>
                      </ul>
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </li>

              <li
                className={`p-2 px-4 bg-transparent transition-colors hover:bg-white ${
                  pathname.startsWith("/blog") ? "bg-white" : ""
                }`}
              >
                <Link
                  href={"/blog"}
                  className="py-2 flex items-center font-montserrat text-sm font-medium justify-between"
                >
                  {t("pages.blog")} <Icons.ArrowRotate />
                </Link>
              </li>
              <li
                className={`p-2 px-4 bg-transparent transition-colors hover:bg-white ${
                  pathname.startsWith("/contact") ? "bg-white" : ""
                }`}
              >
                <Link
                  href={"/contact"}
                  className="py-2 flex items-center font-montserrat text-sm font-medium justify-between"
                >
                  {t("pages.contact")} <Icons.ArrowRotate />
                </Link>
              </li>
            </ul>
            <ul className="mt-2 p-4 border-t border-t-ui-22 grid grid-cols-2 gap-4 gap-y-6">
              {existingContactData?.email && (
                <li className="flex flex-col space-y-3">
                  <span className="font-montserrat text-ui-1 text-sm font-normal">
                    {t("sidebar.email")}
                  </span>
                  <CustomLink
                    href={`mailto:${existingContactData?.email}`}
                    className="font-montserrat text-ui-1 text-sm font-normal"
                  >
                    {existingContactData?.email}
                  </CustomLink>
                </li>
              )}
              <li className="flex flex-col space-y-3">
                <span className="font-montserrat text-ui-1 text-sm font-normal">
                  {t("sidebar.socials")}
                </span>
                <ul className="flex flex-wrap lg:items-center gap-4">
                  {socialData?.map((item, _) => {
                    return (
                      <li key={item?.documentId}>
                        <CustomLink
                          key={item?.documentId}
                          href={item?.socialLink}
                          title={item.socialName}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={item.socialName}
                        >
                          {renderSocialIcon(item?.iconName)}
                        </CustomLink>
                      </li>
                    );
                  })}
                </ul>
              </li>
              {existingContactData?.phone && (
                <li className="flex flex-col space-y-3">
                  <span className="font-montserrat text-ui-1 text-sm font-normal">
                    {t("sidebar.phone")}
                  </span>
                  <CustomLink
                    href={`tel:+${clearPhoneRegex(existingContactData?.phone)}`}
                    className="font-montserrat text-ui-1 text-sm font-normal"
                  >
                    {existingContactData?.phone}
                  </CustomLink>
                  {existingContactData?.phoneSecond && (
                    <CustomLink
                      href={`tel:+${clearPhoneRegex(
                        existingContactData?.phoneSecond
                      )}`}
                      className="font-montserrat text-ui-1 text-sm font-normal"
                    >
                      {existingContactData?.phoneSecond}
                    </CustomLink>
                  )}
                </li>
              )}
            </ul>
          </MotionNav>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isSidebarOpen && (
          <MotionDiv
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 w-full overflow-hidden h-full bg-ui-17 z-10"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}
