import Icons from "@/public/icons";
import { getContact } from "@/src/actions/client/contact.actions";
import { getSocials } from "@/src/actions/client/social.actions";
import Logo from "@/src/globalElements/logo";
import { useMultiServerQuery } from "@/src/hooks/useServerActions";
import { Link } from "@/src/i18n/navigation";
import { clearPhoneRegex } from "@/src/lib/domburify";
import { CustomLocales } from "@/src/services/interface";
import { renderSocialIcon } from "@/src/utils/renderSocials";
import { useLocale, useTranslations } from "next-intl";
import CustomLink from "next/link";
import React from "react";

export default function Footer() {
  const locale = useLocale();
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
          locale: locale as CustomLocales,
        },
        gcTime: 10 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    },
  ]);
  const socialData = socialQuery?.data;
  const existingContactData = existingContactQuery?.data;

  const t = useTranslations();
  return (
    <footer className="bg-gray-50 text-gray-700">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8 border-b border-gray-200">
          <div className="flex flex-col gap-y-4 md:col-span-2 lg:col-span-1">
            <Logo isWhite={false} />
            <p className="text-gray-600 text-sm">
              {existingContactData?.data?.translations?.tag}
            </p>

            <div className="flex items-center flex-wrap gap-3 mt-2">
              {socialData?.data?.map((item, _) => {
                return (
                  <CustomLink
                    key={item?.documentId}
                    href={item?.socialLink}
                    title={item.socialName}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.socialName}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-ui-1 hover:bg-ui-1 hover:text-white transition-all duration-300"
                  >
                    {renderSocialIcon(item?.iconName)}
                  </CustomLink>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-y-4">
            <strong className="text-lg font-semibold text-gray-900">
              {t("footer.pages")}
            </strong>

            {/* Linklər - Normal mətn rəngi qara, hover rəngi ui-1 */}
            <div className="flex flex-col gap-y-2 text-gray-700 text-sm">
              <Link
                href={"/partner"}
                className="hover:text-ui-1 transition-colors w-max"
              >
                {t("pages.partner")}
              </Link>
              <Link
                href={"/services"}
                className="hover:text-ui-1 transition-colors w-max"
              >
                {t("pages.services")}
              </Link>
              <Link
                href={"/certificates"}
                className="hover:text-ui-1 transition-colors w-max"
              >
                {t("pages.certificates")}
              </Link>
              <Link
                href={"/media/photo-gallery"}
                className="hover:text-ui-1 transition-colors w-max"
              >
                {t("pages.photo-gallery")}
              </Link>
              <Link
                href={"/media/video-gallery"}
                className="hover:text-ui-1 transition-colors w-max"
              >
                {t("pages.video-gallery")}
              </Link>
              <Link
                href={"/blog"}
                className="hover:text-ui-1 transition-colors w-max"
              >
                {t("pages.blog")}
              </Link>
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="flex flex-col gap-y-4">
            <strong className="text-lg font-semibold text-gray-900">
              {t("footer.contactUs")}
            </strong>
            <div className="flex flex-col space-y-3 text-gray-600 text-sm">
              {/* Adress */}
              {existingContactData?.data?.translations?.[0]?.adress && (
                <div className="flex items-start gap-x-2">
                  <Icons.Adress />
                  {existingContactData?.data?.adressLink ? (
                    <CustomLink
                      className="not-italic"
                      href={existingContactData?.data?.adressLink}
                    >
                      {existingContactData?.data?.translations?.[0]?.adress}
                    </CustomLink>
                  ) : (
                    <address className="not-italic">
                      {existingContactData?.data?.translations?.[0]?.adress}
                    </address>
                  )}
                </div>
              )}
              {existingContactData?.data?.email && (
                <div className="flex items-start gap-x-2">
                  <Icons.Mail />
                  <CustomLink
                    href={`mailto:${existingContactData?.data?.email}`}
                    className="hover:text-ui-1 transition-colors"
                  >
                    {existingContactData?.data?.email}
                  </CustomLink>
                </div>
              )}

              {existingContactData?.data?.phone && (
                <div className="flex items-start gap-x-2">
                  <Icons.Phone />
                  <CustomLink
                    href={`tel:+${clearPhoneRegex(
                      existingContactData?.data?.phone
                    )}`}
                    className="hover:text-ui-1 transition-colors"
                  >
                    {existingContactData?.data?.phone}
                  </CustomLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alt Hissə */}
        <div className="flex items-center flex-col lg:flex-row lg:justify-between py-4">
          <p className="text-gray-500 text-sm order-2 lg:order-1 mt-3 lg:mt-0 text-center lg:text-unset">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>

          {/* Alt Menyu */}
          <ul className="flex space-x-6 order-1 lg:order-2">
            <li>
              <Link
                href={"/" as any}
                className="text-gray-500 hover:text-ui-1 transition-colors text-sm"
              >
                {t("pages.about")}
              </Link>
            </li>
            <li>
              <Link
                href={"/" as any}
                className="text-gray-500 hover:text-ui-1 transition-colors text-sm"
              >
                {t("footer.contactUs")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
