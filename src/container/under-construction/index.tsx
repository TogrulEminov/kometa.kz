"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UnderConstructionPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // ✅ Client-side-da .env oxunur
    const launchTimeStr =
      process.env.NEXT_PUBLIC_LAUNCH_TIME || "2024-12-31T23:59:59Z";
    const launchTime = new Date(launchTimeStr);

    console.log("Launch Time:", launchTimeStr); // Debug

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = launchTime.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // ✅ SSR hydration mismatch-dən qaçmaq üçün
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen py-20 flex items-center justify-center bg-[var(--color-ui-1)] px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-ui-4)]/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--color-ui-11)]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-ui-4)]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--color-ui-4)]/20 rounded-3xl blur-2xl" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-[var(--color-ui-4)] to-[var(--color-ui-11)] rounded-3xl flex items-center justify-center shadow-2xl">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-6xl lg:text-8xl font-black text-white mb-6 tracking-tight">
            Tezliklə
          </h1>
          <p className="text-2xl lg:text-3xl text-[var(--color-ui-2)] font-light max-w-2xl mx-auto">
            Ağır yükləriniz bizimlə yüngülləşir
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--color-ui-4)]" />
            <div className="w-2 h-2 bg-[var(--color-ui-4)] rounded-full animate-pulse" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--color-ui-4)]" />
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
          {[
            { label: "Gün", value: timeLeft.days },
            { label: "Saat", value: timeLeft.hours },
            { label: "Dəqiqə", value: timeLeft.minutes },
            { label: "Saniyə", value: timeLeft.seconds },
          ].map((item, index) => (
            <div key={index} className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-ui-4)]/20 to-[var(--color-ui-11)]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Timer Card */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 lg:p-10 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-[var(--color-ui-4)]/50">
                <div className="text-5xl lg:text-7xl font-black text-white mb-3 tabular-nums">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-sm lg:text-base text-[var(--color-ui-2)] uppercase tracking-widest font-semibold">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="text-center mb-12">
          <p className="text-[var(--color-ui-2)] text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
            Sizə inanılmaz bir təcrübə gətirmək üçün çox çalışırıq.
            <span className="text-[var(--color-ui-4)] font-semibold">
              {" "}
              Xüsusi bir şey{" "}
            </span>
            üçün bizimlə qalın!
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email Card */}

          <Link
            href="mailto:sales@profitransport.az"
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-ui-4)]/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:border-[var(--color-ui-4)]/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-ui-4)] to-[var(--color-ui-11)] rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[var(--color-ui-2)] text-sm font-semibold mb-1">
                    Email
                  </div>
                  <div className="text-white text-lg font-bold break-all">
                    sales@profitransport.az
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Phone Card */}

          <Link href="tel:+994512515999" className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-ui-11)]/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:border-[var(--color-ui-11)]/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-ui-11)] to-[var(--color-ui-4)] rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[var(--color-ui-2)] text-sm font-semibold mb-1">
                    Telefon
                  </div>
                  <div className="text-white text-lg font-bold">
                    +994 51 251 59 99
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex justify-center items-center gap-3">
          <span className="text-[var(--color-ui-2)] text-sm font-medium mr-2">
            Bizi izləyin:
          </span>
          {[
            {
              link: "https://www.instagram.com/profitransport_az/",
              name: "WhatsApp",
              icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
            },
            {
              link: "https://www.instagram.com/profitransport_az/",
              name: "Instagram",
              icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
            },
            {
              link: "https://www.linkedin.com/company/profitransportllc/",
              name: "LinkedIn",
              icon: "M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z",
            },
          ].map((social, index) => (
            <Link
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-[var(--color-ui-4)]/20 transition-all hover:scale-110 border border-white/10 hover:border-[var(--color-ui-4)]/50 group"
              aria-label={social.name}
            >
              <svg
                className="w-5 h-5 text-white group-hover:text-[var(--color-ui-4)] transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d={social.icon} />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
