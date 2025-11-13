import React from "react";

export default function OurBranches() {
  return (
    <>
      <section className="py-12 lg:py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-ui-1 mb-4">
              Filiallarımız
            </h3>
            <p className="text-lg text-ui-7 max-w-2xl mx-auto">
              Azərbaycan və digər ölkələrdə yerləşən filiallarımızla sizə yaxın
              xidmət göstəririk
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Filial məlumatları */}
            <div className="space-y-6">
              <div className="bg-ui-6 rounded-xl p-6 border border-ui-2">
                <h4 className="text-lg font-semibold text-ui-1 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-ui-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Baş Ofis - Bakı
                </h4>
                <div className="space-y-2 text-sm text-ui-7">
                  <p>Nizami kuçəsi 96, Bakı, Azərbaycan</p>
                  <p>Telefon: +994 12 123 45 67</p>
                  <p>Email: baku@company.az</p>
                  <p>İş saatları: B.e - Cümə, 09:00-18:00</p>
                </div>
              </div>

              <div className="bg-ui-6 rounded-xl p-6 border border-ui-2">
                <h4 className="text-lg font-semibold text-ui-1 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-ui-11"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Filial - Gəncə
                </h4>
                <div className="space-y-2 text-sm text-ui-7">
                  <p>Heydər Əliyev prospekti 34, Gəncə</p>
                  <p>Telefon: +994 22 456 78 90</p>
                  <p>Email: ganja@company.az</p>
                  <p>İş saatları: B.e - Cümə, 09:00-18:00</p>
                </div>
              </div>

              <div className="bg-ui-6 rounded-xl p-6 border border-ui-2">
                <h4 className="text-lg font-semibold text-ui-1 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Filial - Sumqayıt
                </h4>
                <div className="space-y-2 text-sm text-ui-7">
                  <p>28 May kuçəsi 12, Sumqayıt</p>
                  <p>Telefon: +994 18 789 01 23</p>
                  <p>Email: sumgait@company.az</p>
                  <p>İş saatları: B.e - Cümə, 09:00-18:00</p>
                </div>
              </div>
            </div>

            {/* Xəritə */}
            <div className="lg:col-span-2">
              <div className="bg-ui-6 rounded-xl p-2 border border-ui-2">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194473.88614645443!2d49.69315!3d40.3947365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1635789012345!5m2!1sen!2s"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: "8px" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Azərbaycan Filialları"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
