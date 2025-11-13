import React from "react";
import Icons from "@/public/icons";
import CustomLink from "next/link";
import bgImage from "@/public/assets/bg-03.jpg";
import { Link } from "@/src/i18n/navigation";
import CustomImage from "@/src/globalElements/ImageTag";
import { getForCards } from "@/src/utils/getFullimageUrl";
import { ContactInfo, FileType, ServicesItem } from "@/src/services/interface";
import { getTranslations } from "next-intl/server";
import { clearPhoneRegex } from "@/src/lib/domburify";
interface Props {
  mainData: ServicesItem[];
  contactData: ContactInfo;
}
export default async function LeftArea({ contactData, mainData }: Props) {
  const t = await getTranslations();
  return (
    <aside className="lg:col-span-4  order-2 lg:order-1">
      <div className="lg:sticky lg:top-24 space-y-5">
        {/* Services */}
        <div className="bg-white rounded-xl border border-ui-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-gradient-to-r from-ui-1 to-ui-1/90 px-5 py-4">
            <strong className="text-base font-bold text-white">
              {t("servicesPage.four")}
            </strong>
          </div>
          <div className="p-4 space-y-1">
            {mainData?.map((service, _) => {
              const translations = service?.translations?.[0];

              return (
                <Link
                  key={service?.documentId}
                  href={{
                    pathname: "/services/[slug]",
                    params: { slug: translations?.slug },
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-ui-10 transition-all duration-200 text-sm group"
                >
                  <div className="text-ui-1 flex items-center gap-x-2 font-medium group-hover:text-ui-4 transition-colors">
                    <CustomImage
                      width={16}
                      height={16}
                      title={translations?.title}
                      src={getForCards(service?.iconsUrl as FileType)}
                    />
                    {translations?.title}
                  </div>
                  <Icons.ChevronRight className="w-4 h-4 text-ui-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ui-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-gradient-to-r from-ui-1 to-ui-1/90 px-5 py-4">
            <strong className="text-base font-bold text-white">
              {t("servicesPage.five")}
            </strong>
          </div>
          <div className="p-5 space-y-3">
            {/* Email */}
            {contactData?.email && (
              <div className="group">
                <div className="flex items-center justify-between gap-3 p-4 rounded-xl hover:bg-ui-10 transition-all">
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("servicesPage.email")}
                    </p>
                    <CustomLink
                      href={`mailto:${contactData?.email}`}
                      className="text-base font-semibold text-ui-1 hover:text-ui-4 transition-colors block break-words"
                    >
                      {contactData?.email}
                    </CustomLink>
                  </div>

                  <div className="w-12 h-12 rounded-full text-ui-4 bg-ui-10 group-hover:bg-white flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icons.Mail />
                  </div>
                </div>
                <div className="h-px bg-ui-2 mx-4"></div>
              </div>
            )}
            {/* Phone */}
            {contactData?.phone && (
              <div className="group">
                <div className="flex items-center justify-between gap-3 p-4 rounded-xl hover:bg-ui-10 transition-all">
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("servicesPage.phone")}
                    </p>
                    <CustomLink
                      href={`tel:${clearPhoneRegex(contactData?.phone)}`}
                      className="text-base font-semibold text-ui-1 hover:text-ui-4 transition-colors block"
                    >
                      {contactData?.phone}
                    </CustomLink>
                  </div>
                  <div className="w-12 h-12 rounded-full text-ui-4 bg-ui-10 group-hover:bg-white flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icons.Phone />
                  </div>
                </div>
                <div className="h-px bg-ui-2 mx-4"></div>
              </div>
            )}

            {/* Location */}
            {contactData?.translations?.[0]?.adress && (
              <div className="group">
                <div className="flex items-center justify-between gap-3 p-4 rounded-xl hover:bg-ui-10 transition-all">
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("servicesPage.adress")}
                    </p>
                    <p className="text-base font-semibold text-ui-1">
                      {contactData?.translations?.[0]?.adress}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full text-ui-4 bg-ui-10 group-hover:bg-white flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icons.Adress />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 24/7 Support */}
        <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <CustomImage
            width={400}
            height={320}
            title="24/7 Support"
            className="absolute inset-0 w-full h-full object-cover"
            src={bgImage}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ui-1/95 via-ui-1/90 to-ui-4/80"></div>

          <div className="relative p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full text-white bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto shadow-lg border-2 border-white/30">
              <Icons.HeadPhone />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {t("servicesPage.support")}
              </h3>
              <p className="text-white/90 text-sm leading-relaxed">
                {t("servicesPage.six")}
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <CustomLink
                href={`tel:${clearPhoneRegex(contactData?.phone)}`}
                className="block text-white font-bold hover:text-ui-5 transition-colors text-lg"
              >
                {contactData?.phone}
              </CustomLink>
              <CustomLink
                href={`mailto:${contactData?.email}`}
                className="block text-white/95 hover:text-white transition-colors text-sm font-medium"
              >
                {contactData?.email}
              </CustomLink>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
