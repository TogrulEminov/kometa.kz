"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Role, User } from "@/src/generated/prisma";
import { usePostData } from "@/src/hooks/useApi";

const availableRoles = [Role.ADMIN, Role.CONTENT_MANAGER];

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: Role.CONTENT_MANAGER,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { mutate: createData, isPending } = usePostData<User>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await createData({
        payload: formData,
        endpoint: "auth/create-user",
      });
      setSuccess(
        "İstifadəçi uğurla yaradıldı! İstifadəçilər səhifəsinə yönləndirilir..."
      );
      // Formanı təmizləyirik
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        role: Role.CONTENT_MANAGER,
      });
      setTimeout(() => {
        router.push("/manage/users");
      }, 2000);
    } catch (err: any) {
      setError(err?.data || "İstifadəçi yaradılarkən xəta baş verdi.");
    }
  };

  return (
    <div className="max-w-[600px] py-5 w-full">
      <h2 className="text-2xl font-bold mb-5 text-[#555]">
        Yeni İstifadəçi Yarat
      </h2>

      <form className={"flex flex-col gap-y-5"} onSubmit={handleSubmit}>
        <div className={"flex flex-col gap-2"}>
          <label htmlFor="name" className={"text-sm font-medium text-[#555]"}>
            Ad, Soyad
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={
              "px-4 py-3 border-2 border-[#e1e5e9]  rounded-lg text-base ease-border outline-none focus:border-[#3b82f6]"
            }
            placeholder="İstifadəçinin ad və soyadını daxil edin"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className={"flex flex-col gap-2"}>
          <label
            htmlFor="username"
            className={"text-sm font-medium text-[#555]"}
          >
            İstifadəçi Adı (Username)
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className={
              "px-4 py-3 border-2 border-[#e1e5e9]  rounded-lg text-base ease-border outline-none focus:border-[#3b82f6]"
            }
            placeholder="Unikal istifadəçi adı daxil edin"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className={"flex flex-col gap-2"}>
          <label htmlFor="email" className={"text-sm font-medium text-[#555]"}>
            Email Adresi
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={
              "px-4 py-3 border-2 border-[#e1e5e9]  rounded-lg text-base ease-border outline-none focus:border-[#3b82f6]"
            }
            placeholder="Email adresini daxil edin"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className={"flex flex-col gap-2"}>
          <label
            htmlFor="password"
            className={"text-sm font-medium text-[#555]"}
          >
            Parol
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className={
              "px-4 py-3 border-2 border-[#e1e5e9]  rounded-lg text-base ease-border outline-none focus:border-[#3b82f6]"
            }
            placeholder="Yeni parol daxil edin"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className={"flex flex-col gap-2 mb-3"}>
          <label className={"text-sm font-medium text-[#555]"}>
            İstifadəçi Rolu
          </label>
          <div className="flex items-center gap-5">
            {availableRoles.map((role) => (
              <label
                key={role}
                className="text-[#555] flex cursor-pointer items-center text-base gap-1"
              >
                <input
                  type="radio"
                  name="role"
                  value={role}
                  className="w-4 rounded-sm border border-[#2563eb] appearance-none h-4 cursor-pointer checked:bg-[#2563eb]"
                  checked={formData.role === role}
                  onChange={handleChange}
                />
                {role}
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className={"text-error text-base font-medium"}>{error}</div>
        )}
        {success && (
          <div
            className={
              "text-success  rounded-lg p-2.5 text-center mt-2.5  text-base font-medium"
            }
          >
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={
            "bg-[#3b82f6] text-white px-6 py-3 border-0 rounded-lg mt-2.5 cursor-pointer ease-background hover:bg-[#2563eb] disabled:bg-[#9ca3af] disabled:cursor-not-allowed"
          }
        >
          {isPending ? "Yaradılır..." : "Hesab Yarat"}
        </button>
      </form>
    </div>
  );
}
