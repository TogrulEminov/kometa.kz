"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useGetData, usePatchData, useDeleteData } from "@/src/hooks/useApi";
import { MotionDiv } from "@/src/lib/motion/motion";
import { Trash2, AlertTriangle } from "lucide-react";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  role: string;
};

export default function UsersPage() {
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useGetData<User[]>("/auth/users");
  const {
    mutate: generatePassword,
    isPending: isGenerating,
    isError,
    error,
  } = usePatchData<User>();

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteData<User>({
    onSuccess: () => {
      setApiSuccess("İstifadəçi uğurla silindi!");
      setDeleteModalState({ isOpen: false, selectedUser: null });
      refetch();
      setTimeout(() => setApiSuccess(""), 3000);
    },
    onError: (err: any) => {
      setApiError(err.data?.error || "İstifadəçi silinərkən xəta baş verdi");
      setTimeout(() => setApiError(""), 3000);
    },
  });

  const { data } = useSession();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    selectedUser: User | null;
  }>({ isOpen: false, selectedUser: null });

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    selectedUser: User | null;
  }>({ isOpen: false, selectedUser: null });

  const [newPassword, setNewPassword] = useState("");
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const createStrongPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 14; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  const handleCopyPassword = () => {
    if (!newPassword) return;
    navigator.clipboard.writeText(newPassword);
    setCopySuccess("Şifrə kopyalandı!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleOpenModal = (user: User) => {
    setModalState({ isOpen: true, selectedUser: user });
    setNewPassword("");
    setApiError("");
    setApiSuccess("");
    setCopySuccess("");
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, selectedUser: null });
  };

  const handleOpenDeleteModal = (user: User) => {
    setDeleteModalState({ isOpen: true, selectedUser: user });
    setApiError("");
    setApiSuccess("");
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalState({ isOpen: false, selectedUser: null });
  };

  const handleGeneratePassword = async () => {
    if (!modalState.selectedUser || !newPassword) {
      setApiError("Yeni şifrə daxil edilməlidir.");
      return;
    }
    setApiError("");
    setApiSuccess("");

    try {
      await generatePassword({
        endpoint: "auth/password/generate",
        payload: {
          userId: modalState.selectedUser.id,
          newPassword,
        },
      });

      setApiSuccess(
        `'${modalState.selectedUser.name}' üçün şifrə uğurla yeniləndi!`
      );
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err: any) {
      setApiError(err.data?.message || "Xəta baş verdi.");
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModalState.selectedUser) return;

    await deleteUser({
      endpoint: `/auth/users/${deleteModalState.selectedUser.id}`,
    });
  };

  if (isLoading) return <p>Yüklənir...</p>;
  if (isError) return <p>Xəta baş verdi: {(error as any).data?.message}</p>;

  if (data?.user?.role !== "SUPER_ADMIN") {
    redirect("/manage/dashboard");
  }

  return (
    <div className="font-inter">
      {/* Success/Error Messages */}
      {apiSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {apiSuccess}
        </div>
      )}
      {apiError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {apiError}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-black">
          İstifadəçi İdarəetməsi
        </h1>
        <Link
          href="/manage/create-user"
          className="bg-[#2563eb] text-white px-6 py-3 border-0 rounded-sm mt-2.5 cursor-pointer ease-background hover:bg-[#5366cc]"
        >
          Yeni İstifadəçi Yarat
        </Link>
      </div>

      <div className="overflow-x-auto shadow-sm">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-1/6 py-4 px-6 text-left whitespace-nowrap text-gray-600 font-bold uppercase">
                ID
              </th>
              <th className="w-1/6 py-4 px-6 text-left whitespace-nowrap text-gray-600 font-bold uppercase">
                Ad, Soyad
              </th>
              <th className="w-1/6 py-4 px-6 text-left whitespace-nowrap text-gray-600 font-bold uppercase">
                İstifadəçi Adı
              </th>
              <th className="w-1/6 py-4 px-6 text-left whitespace-nowrap text-gray-600 font-bold uppercase">
                Email
              </th>
              <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Rol
              </th>
              <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Əməliyyatlar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user: User) => (
              <tr key={user.id}>
                <td className="py-4 px-6 border-b whitespace-nowrap border-gray-200">
                  {user.id}
                </td>
                <td className="py-4 px-6 border-b whitespace-nowrap border-gray-200">
                  {user.name}
                </td>
                <td className="py-4 px-6 border-b whitespace-nowrap border-gray-200">
                  {user.username}
                </td>
                <td className="py-4 px-6 border-b whitespace-nowrap border-gray-200 truncate">
                  {user.email}
                </td>
                <td className="py-4 px-6 border-b whitespace-nowrap border-gray-200">
                  <span
                    className={`px-2 py-2 rounded-xl whitespace-nowrap text-sm font-bold flex items-center justify-center w-fit text-white ${
                      user.role.toLowerCase() === "super_admin"
                        ? "bg-[#dc3545]"
                        : user.role.toLowerCase() === "admin"
                        ? "bg-[#ffc107] text-[#555]"
                        : "bg-[#17a2b8]"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-4 whitespace-nowrap px-6 border-b border-gray-200">
                  <div className="flex gap-2">
                    <button
                      className="py-2 whitespace-nowrap px-2.5 border cursor-pointer border-[#ccc] rounded-[5px] hover:bg-[#f1f1f1] transition-colors"
                      onClick={() => handleOpenModal(user)}
                    >
                      Şifrəni Yenilə
                    </button>
                    <button
                      className="py-2 shrink-0 whitespace-nowrap px-2.5 border cursor-pointer border-red-500 text-red-600 rounded-[5px] hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      onClick={() => handleOpenDeleteModal(user)}
                      disabled={user.role === "SUPER_ADMIN" || isDeleting}
                      title={
                        user.role === "SUPER_ADMIN"
                          ? "SUPER_ADMIN silinə bilməz"
                          : "İstifadəçini sil"
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Password Update Modal */}
      {modalState.isOpen && (
        <MotionDiv
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
          transition={{ duration: 0.3 }}
        >
          <MotionDiv
            className="bg-white p-8 rounded-sm w-full max-w-[500px]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 font-bold">
              Şifrəni Yenilə: {modalState.selectedUser?.name}
            </h2>
            <p className="text-[#666]">
              İstifadəçi üçün yeni şifrə təyin edin. Aşağıdakı düymə ilə güclü
              şifrə yarada və ya özünüz daxil edə bilərsiniz.
            </p>

            <div className="flex items-stretch gap-2.5 mt-4">
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Yeni şifrəni daxil edin"
                className="grow-[1] px-4 py-2.5 m-0 border-[#ddd] outline-none border w-full h-full"
              />
              <button
                onClick={handleCopyPassword}
                className="px-4 py-2.5 border border-[#ccc] bg-[#f0f0f0] cursor-pointer rounded-[5px]"
                title="Şifrəni kopyala"
              >
                Copy
              </button>
            </div>

            <button
              onClick={createStrongPassword}
              className="w-full p-2.5 mt-2.5 bg-[#28a745] text-white border-none rounded-sm cursor-pointer"
            >
              Güclü Şifrə Yarat
            </button>

            {copySuccess && (
              <p className="text-[#3b82f6] text-sm text-center mt-2.5">
                {copySuccess}
              </p>
            )}

            {apiError && (
              <p className="text-error text-sm text-center mt-2.5">
                {apiError}
              </p>
            )}
            {apiSuccess && (
              <p className="text-success text-sm text-center mt-2.5">
                {apiSuccess}
              </p>
            )}

            <div className="flex items-center justify-end gap-4 mt-5">
              <button
                onClick={handleCloseModal}
                className="px-5 py-3 bg-[#b0b0b0] rounded-sm cursor-pointer text-white"
              >
                Ləğv Et
              </button>
              <button
                onClick={handleGeneratePassword}
                disabled={isGenerating || !newPassword}
                className="bg-[#3b82f6] to-white px-2.5 py-3 rounded-sm cursor-pointer disabled:bg-[#9ca3af] disabled:text-white disabled:cursor-not-allowed"
              >
                {isGenerating ? "Yenilənir..." : "Yadda Saxla"}
              </button>
            </div>
          </MotionDiv>
        </MotionDiv>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalState.isOpen && (
        <MotionDiv
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseDeleteModal}
          transition={{ duration: 0.3 }}
        >
          <MotionDiv
            className="bg-white p-8 rounded-lg w-full max-w-[450px] mx-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              İstifadəçini Sil
            </h2>

            {/* Message */}
            <p className="text-center text-gray-600 mb-2 text-sm leading-relaxed">
              <strong>{deleteModalState.selectedUser?.name}</strong> adlı
              istifadəçini silmək istədiyinizdən əminsiniz?
            </p>
            <p className="text-center text-red-600 text-sm mb-6">
              Bu əməliyyat geri qaytarıla bilməz.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-5 py-3 bg-gray-100 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Ləğv et
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex-1 px-5 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <span>Silinir...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Bəli, sil</span>
                  </>
                )}
              </button>
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </div>
  );
}
