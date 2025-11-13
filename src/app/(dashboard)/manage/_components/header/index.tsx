"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import useOutSideClick from "@/src/hooks/useOutSideClick";
import {
  Menu,
  ChevronDown,
  User,
  Lock,
  LogOut,
  UserPlus,
  Shield,
} from "lucide-react";
import { useToggleStore } from "@/src/lib/zustand/useMultiToggleStore";

const Header = () => {
  const ref = useRef(null);
  const { open, handleToggle: handleUserDrop } = useOutSideClick({ ref: ref });
  const { data, status } = useSession();

  const displayName =
    status === "loading" ? "İstifadəçi" : data?.user?.username;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const toggle = useToggleStore((state) => state.toggle);

  return (
    <header className="fixed z-50 bg-blue-600 w-full h-16 px-6 flex items-center shadow-md">
      <div className="flex items-center justify-between w-full">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => toggle("admin-sidebar")}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <Link
            href="/"
            className="text-xl font-bold text-white font-poppins flex items-center gap-2"
          >
            <Shield className="w-6 h-6" />
            Admin Panel
          </Link>
        </div>

        {/* Right Side - User Menu */}
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={handleUserDrop}
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold text-white">
                {displayName}
              </span>
              <span className="text-xs text-blue-100">{data?.user?.role}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-white transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">{data?.user?.role}</p>
              </div>
              <Link
                href="/manage/change-password"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Şifrəni dəyiş
              </Link>
              {data?.user?.role === "SUPER_ADMIN" && (
                <Link
                  href="/manage/create-user"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  İstifadəçi yarat
                </Link>
              )}
              <hr className="my-2 border-gray-200" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer w-full"
              >
                <LogOut className="w-4 h-4" />
                Çıxış et
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
