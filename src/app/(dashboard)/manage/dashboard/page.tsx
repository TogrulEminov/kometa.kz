import React from "react";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Award,
  Users,
  MessageSquare,
  Settings,
  Globe,
  Mail,
  Images,
  Video,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const menuItems = [
    {
      title: "Bloqlar",
      description: "Bloq yazılarını idarə edin",
      icon: FileText,
      href: "/manage/blog",
      color: "bg-[#effaff]",
      iconColor: "text-[#0c7fa3]",
    },
    {
      title: "Xidmətlər",
      description: "Xidmətləri əlavə edin və redaktə edin",
      icon: Briefcase,
      href: "/manage/service",
      color: "bg-[#effaff]",
      iconColor: "text-[#0c7fa3]",
    },
    {
      title: "Sertifikatlar",
      description: "Şirkət sertifikatlarını idarə edin",
      icon: Award,
      href: "/manage/certificate",
      color: "bg-[#effaff]",
      iconColor: "text-[#0c7fa3]",
    },
    {
      title: "Əməkdaşlar",
      description: "Komanda üzvlərini idarə edin",
      icon: Users,
      href: "/manage/employee",
      color: "bg-[#effaff]",
      iconColor: "text-[#0c7fa3]",
    },
    {
      title: "Media",
      description: "Video materiallar",
      icon: Video,
      href: "/manage/youtube-media",
      color: "bg-[#effaff]",
      iconColor: "text-[#0c7fa3]",
    },
    {
      title: "Qalereya",
      description: "Şəkil materiallar",
      icon: Images,
      href: "/manage/photo-gallery",
      color: "bg-[#effaff]",
      iconColor: "text-[#0c7fa3]",
    },
    {
      title: "Partnyorlar",
      description: "Biznes partnyorları idarə edin",
      icon: Globe,
      href: "/manage/partners",
      color: "bg-[#effaff]",
      iconColor: "text-[#0c7fa3]",
    },
    {
      title: "Haqqımızda",
      description: "Şirkət məlumatları və kontakt",
      icon: Mail,
      href: "/manage/about",
      color: "bg-[#effaff]",
      iconColor: "text-[#0c7fa3]",
    },
    {
      title: "Sosial Şəbəkələr",
      description: "Sosial media hesabları",
      icon: MessageSquare,
      href: "/manage/socials",
      color: "bg-[#effaff]",
      iconColor: "text-[#0c7fa3]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="bg-white border-b border-[#dee2e6]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#003751] rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#003751]">
                İdarə Paneli
              </h1>
              <p className="text-[#575a7b] mt-1">
                Məzmunu idarə etmək üçün bölmə seçin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className="group bg-white rounded-xl border border-[#dee2e6] p-6 hover:shadow-lg hover:border-[#0c7fa3] transition-all duration-200"
              >
                <div className="flex flex-col h-full">
                  <div
                    className={`w-14 h-14 ${item.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#003751] mb-2 group-hover:text-[#0c7fa3] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#575a7b] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl border border-[#dee2e6] p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#effaff] rounded-lg flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-[#0c7fa3]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#003751] mb-2">
                Sistem Məlumatı
              </h3>
              <p className="text-[#575a7b] leading-relaxed">
                Bütün məzmun üç dildə idarə olunur: Azərbaycan, İngilis və Rus
                dilləri. Hər hansı bir dəyişiklik avtomatik olaraq bütün
                dillərdə əks olunacaq.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
