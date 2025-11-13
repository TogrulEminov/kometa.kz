import CustomImage from "@/src/globalElements/ImageTag";
import { sanitizeHtml } from "@/src/lib/domburify";
import {
  About,
  CountGenericType,
  FileType,
  InfoGenericType,
} from "@/src/services/interface";
import { parseJSON } from "@/src/utils/checkSlug";
import { getForCards } from "@/src/utils/getFullimageUrl";
import React from "react";
interface Props {
  data: About;
}
export default async function AboutContent({ data }: Props) {
  const translations = data?.translations?.[0];
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-ui-5 via-white to-ui-6 relative">
      {/* Soft background elements */}
      <div className="hidden lg:block absolute top-20 right-0 w-px h-32 bg-gradient-to-b from-transparent via-ui-2 to-transparent"></div>
      <div className="hidden lg:block absolute bottom-20 left-0 w-px h-32 bg-gradient-to-b from-transparent via-ui-2 to-transparent"></div>
      <div className="hidden lg:block absolute top-32 left-1/4 w-64 h-64 bg-ui-4/10 rounded-full blur-3xl"></div>
      <div className="hidden lg:block absolute bottom-32 right-1/4 w-72 h-72 bg-ui-11/10 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <figure className="relative">
            <div className="absolute hidden lg:block lg:-inset-4 border border-ui-9 rounded-xl bg-white/70 backdrop-blur-sm"></div>

            <div className="relative rounded-xl overflow-hidden bg-ui-3 w-full h-h-full lg:aspect-3/4 shadow-xl">
              <CustomImage
                src={getForCards(data?.imageUrl as FileType)}
                title={translations?.title || "Logistics Company"}
                className="w-full h-full object-cover"
                width={600}
                height={600}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ui-1/20 via-transparent to-transparent"></div>
            </div>

            <div className="absolute max-w-fit -bottom-0 -right-0 md:-bottom-8 md:-right-8 bg-white/95 backdrop-blur-sm rounded-md lg:rounded-2xl shadow-lg border border-ui-8 p-3 lg:p-6">
              <div className="flex items-center gap-4">
                {parseJSON<CountGenericType>(translations?.statistics)?.map(
                  (stat, index) => (
                    <React.Fragment key={index}>
                      <div className="text-ui-1 max-w-[100px] text-center">
                        <div
                          className={`text-3xl font-semibold mb-1 ${
                            index === 0 ? "text-ui-4" : "text-ui-11"
                          }`}
                        >
                          {stat.count}
                        </div>
                        <div className="text-xs text-ui-7 uppercase tracking-wider">
                          {stat.title}
                        </div>
                      </div>
                      <div className="w-px h-12 bg-ui-9 last:hidden"></div>
                    </React.Fragment>
                  )
                )}
              </div>
            </div>
          </figure>

          <article className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-ui-5 text-ui-4 px-4 py-2 rounded-full text-xs lg:text-sm font-medium border border-ui-9">
                <div className="w-2 h-2 bg-ui-4 rounded-full"></div>
                {translations?.badge}
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-ui-1 leading-tight tracking-tight">
                {translations?.title}
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-ui-4 to-ui-11 rounded-full"></div>
            </div>

            <div className="text-ui-7 lg:max-h-[300px] leading-loose font-normal overflow-y-auto scrollbar-thin scrollbar-color space-y-4">
              {translations?.subtitle && (
                <p className="text-lg text-ui-4 font-medium">
                  {translations.subtitle}
                </p>
              )}
              <article
                className="services_list"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(translations?.description),
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-6 border-t border-ui-2">
              {parseJSON<InfoGenericType>(translations?.features)?.map(
                (feature, index) => {
                  const colors = ["ui-4", "ui-11", "ui-4", "ui-11"];
                  const backgrounds = [
                    "ui-5/70",
                    "ui-3/70",
                    "ui-6/70",
                    "ui-10/70",
                  ];

                  return (
                    <div
                      key={index}
                      className={`space-y-2 bg-${
                        backgrounds[index % 4]
                      } rounded-lg p-2 lg:p-4 border border-ui-9`}
                    >
                      <h3 className="text-ui-1 font-semibold text-xs sm:text-sm flex items-center gap-2">
                        <div
                          className={`w-2 h-2 bg-${
                            colors[index % 4]
                          } rounded-full`}
                        ></div>
                        {feature.title}
                      </h3>
                    </div>
                  );
                }
              )}
            </div>
          </article>
        </div>

        {/* Alt bölmə - şirkət dəyərləri */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 lg:mt-15 pt-10 lg:pt-16 border-t border-ui-2">
          {parseJSON<InfoGenericType>(translations?.advantages)?.map(
            (value, index) => {
              const colorClasses = [
                {
                  bg: "from-ui-5 to-ui-6",
                  text: "text-ui-4",
                  line: "bg-ui-4/50",
                },
                {
                  bg: "from-ui-3 to-ui-6",
                  text: "text-ui-11",
                  line: "bg-ui-11/50",
                },
                {
                  bg: "from-ui-6 to-ui-10",
                  text: "text-ui-1",
                  line: "bg-ui-1/50",
                },
              ];

              const colorClass = colorClasses[index % 3];

              return (
                <div
                  key={index}
                  className={`space-y-4 bg-gradient-to-br ${colorClass.bg} rounded-2xl p-6 border border-ui-9 hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-4xl font-semibold ${colorClass.text}`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className={`w-12 h-px ${colorClass.line}`}></div>
                  </div>
                  <h3 className="text-lg font-semibold text-ui-1">
                    {value.title}
                  </h3>
                  <p className="text-sm text-ui-7 font-normal leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
