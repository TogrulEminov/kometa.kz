"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToggleState } from "@/src/lib/zustand/useMultiToggleStore";
import {
  FileText,
  Mail,
  Briefcase,
  FileCheck,
  Users,
  Award,
  Video,
  Image,
  Star,
  HelpCircle,
  Zap,
  Building,
  UserCircle,
  MapPin,
  Settings,
  Trash2,
  ArrowRight,
  Images,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";
  const isSidebarOpen = useToggleState("admin-sidebar");

  const menuSections = [
    {
      title: "Əsas səhifələr",
      items: [
        {
          href: "/manage/categories",
          label: "Meta məlumatlar",
          icon: FileText,
        },
        { href: "/manage/contact", label: "Əlaqə", icon: Mail },
        { href: "/manage/service", label: "Xidmətlər", icon: Briefcase },
        { href: "/manage/blog", label: "Bloqlar", icon: FileCheck },
        { href: "/manage/about", label: "Haqqımızda", icon: Users },
        { href: "/manage/partners", label: "Partnyorlar", icon: Users },
        { href: "/manage/branches", label: "Filiallar", icon: Building },
        { href: "/manage/certificates", label: "Sertifikatlar", icon: Award },
        {
          href: "/manage/youtube-media",
          label: "Youtube videolarımız",
          icon: Video,
        },
        {
          href: "/manage/photo-gallery",
          label: "Şəkil qalereyası",
          icon: Images,
        },
      ],
    },
    {
      title: "Ana səhifə",
      items: [
        { href: "/manage/hero", label: "Hero", icon: Image },
        { href: "/manage/features", label: "Niyə biz?", icon: Star },
        { href: "/manage/advantages", label: "Üstünlüklərimiz", icon: Zap },
        {
          href: "/manage/fag",
          label: "Tez-tez verilən suallar",
          icon: HelpCircle,
        },
        {
          href: "/manage/work-process",
          label: "İş prosesləri",
          icon: Settings,
        },
        { href: "/manage/testimonials", label: "Müştəri Rəyləri", icon: Star },
      ],
    },
    {
      title: "Haqqımızda səhifəsi",
      items: [
        { href: "/manage/employee", label: "İşçilərimiz", icon: UserCircle },
      ],
    },
    {
      title: "Ofislərimiz",
      items: [{ href: "/manage/offices", label: "Ofislər", icon: MapPin }],
    },
    {
      title: "Komponentlər",
      items: [
        { href: "/manage/position", label: "Vəzifələr", icon: Briefcase },
        { href: "/manage/socials", label: "Sosial şəbəkələr", icon: Users },
        { href: "/manage/contact-enum", label: "Müraciət mövzusu", icon: Mail },
        {
          href: "/manage/section-content",
          label: "Bölüm başlıqları",
          icon: FileText,
        },
        {
          href: "/manage/section-cta",
          label: "Alt Bölüm başlıqları",
          icon: FileText,
        },
      ],
    },
  ];

  if (isSuperAdmin) {
    menuSections.push({
      title: "Sistem",
      items: [
        { href: "/manage/users", label: "İstifadəçilər", icon: Users },
        { href: "/manage/trash", label: "Zibil qutusu", icon: Trash2 },
      ],
    });
  }

  return (
    <div
      className={`fixed overflow-y-auto h-full z-40 bg-white pt-20 top-0 w-64 transition-transform duration-300 ease-in-out border-r border-gray-200 ${
        isSidebarOpen ? "-translate-x-full" : "translate-x-0"
      } scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
    >
      <div className="flex flex-col gap-6 p-3">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3 py-1">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                          isActive
                            ? "bg-blue-700"
                            : "bg-gray-100 group-hover:bg-blue-50"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? "text-white"
                              : "text-gray-500 group-hover:text-blue-600"
                          }`}
                        />
                      </div>
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && (
                        <ArrowRight className="w-4 h-4 text-white" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
