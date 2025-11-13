"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePostData } from "@/src/hooks/useApi";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const { mutateAsync: changePassword, isPending } = usePostData<{
    message: string;
  }>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Parollar uyğun gəlmir");
      return;
    }

    try {
      const result = await changePassword({
        endpoint: "auth/password/change",
        payload: {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
      });

      if (result) {
        setFormData({
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err: any) {
      setError(err.message || "Parol dəyişdirilə bilmədi");
    }
  };

  return (
    <div className={"flex p-5 min-h-dvh"}>
      <div className="max-w-[600px] w-full">
        <h2 className="text-start text-[#555] text-2xl font-bold mb-5">
          Change your account
        </h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className={"flex flex-col gap-2"}>
            <label
              htmlFor="password"
              className="text-sm text-[#555] font-medium"
            >
              Parolunuz
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="text-[#555] text-sm px-4 py-4 ease-border outline-none rounded-sm border-2 border-[#e1e5e9]"
              placeholder="Parolunuz daxil edin"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className={"flex flex-col gap-2"}>
            <label
              htmlFor="confirmPassword"
              className="text-sm text-[#555] font-medium"
            >
              Parolunuzu təsdiq edin
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="text-[#555] text-sm px-4 py-4 ease-border outline-none rounded-sm border-2 border-[#e1e5e9]"
              placeholder="Parolunuzu yenidən edin"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className={"text-error text-base font-medium"}>{error}</div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={
              "bg-[#3b82f6] text-white px-6 py-3 border-0 rounded-lg mt-2.5 cursor-pointer ease-background hover:bg-[#2563eb] disabled:bg-[#9ca3af] disabled:cursor-not-allowed"
            }
          >
            {isPending ? "Dəyişilir..." : "Dəyiş"}
          </button>
        </form>
      </div>
    </div>
  );
}
