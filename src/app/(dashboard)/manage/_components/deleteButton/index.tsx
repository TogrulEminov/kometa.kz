"use client";

import React, { FC, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Loader2, Trash2 } from "lucide-react";
import { useMessageStore } from "@/src/hooks/useMessageStore";
import { useServerAction } from "@/src/hooks/useServerActions";
import { deleteAction } from "@/src/actions/client/delete.actions";

interface Props {
  id: string;
  model: string;
  action: "soft-delete" | "restore" | "hard-delete";
  refetch?: () => void;
  title?: string;
  invalidateQueryKey: string | string[];
  confirmTitle?: string;
  confirmMessage?: string;
  locale?: string;
}

const DeleteButton: FC<Props> = ({
  id,
  model,
  action,
  title,
  refetch,
  invalidateQueryKey,
  confirmTitle = "Əminsiniz?",
  confirmMessage = "Bu əməliyyatı geri qaytarmaq mümkün olmayacaq.",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { success, error } = useMessageStore();

  // Default titles based on action
  const getDefaultTitle = () => {
    switch (action) {
      case "soft-delete":
        return "Sil";
      case "restore":
        return "Bərpa et";
      case "hard-delete":
        return "Tamamilə sil";
      default:
        return "Sil";
    }
  };

  const buttonTitle = title || getDefaultTitle();

  // Server action mutation
  const { mutate: deleteFunction, isPending } = useServerAction(
    async (input: {
      action: "soft-delete" | "restore" | "hard-delete";
      model: string;
      documentId: string;
    }) => {
      return await deleteAction(input.action, {
        model: input.model,
        documentId: input.documentId,
      });
    },
    {
      invalidateKeys: Array.isArray(invalidateQueryKey)
        ? invalidateQueryKey
        : [invalidateQueryKey],
      onSuccess: (result) => {
        if (result.success) {
          const actionText =
            action === "restore"
              ? "bərpa edildi"
              : action === "hard-delete"
              ? "tamamilə silindi"
              : "zibil qutusuna göndərildi";
          success(result.message || `Məlumat uğurla ${actionText}`);
          setIsModalOpen(false);
          if (refetch) {
            refetch();
          }
        } else {
          error(result.error || "Xəta baş verdi");
        }
      },
      onError: (err) => {
        error("Xəta baş verdi");
        console.error("Delete error:", err.message);
      },
    }
  );

  const handleDelete = useCallback(() => {
    deleteFunction({
      action,
      model,
      documentId: id,
    });
  }, [deleteFunction, action, model, id]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isPending && e.target === e.currentTarget) {
        setIsModalOpen(false);
      }
    },
    [isPending]
  );

  // Button style based on action
  const getButtonStyle = () => {
    switch (action) {
      case "restore":
        return "bg-green-600 hover:bg-green-700";
      case "hard-delete":
        return "bg-red-700 hover:bg-red-800";
      default:
        return "bg-red-600 hover:bg-red-700";
    }
  };

  // Icon based on action
  const getIcon = () => {
    switch (action) {
      case "restore":
        return <Trash2 className="w-4 h-4 rotate-180" />;
      default:
        return <Trash2 className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Delete Button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        className={`flex items-center gap-2 cursor-pointer text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ${getButtonStyle()}`}
        aria-label={`${action}-${model}-${id}`}
      >
        {getIcon()}
        {buttonTitle}
      </button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            >
              {/* Close Button */}
              {!isPending && (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all cursor-pointer"
                  aria-label="Bağla"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Icon */}
              <div
                className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${
                  action === "restore" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <AlertTriangle
                  className={`w-8 h-8 ${
                    action === "restore" ? "text-green-600" : "text-red-600"
                  }`}
                />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                {confirmTitle}
              </h3>

              {/* Message */}
              <p className="text-center text-gray-600 mb-8 text-sm leading-relaxed">
                {confirmMessage}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isPending}
                  className="flex-1 px-5 py-3 bg-gray-100 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className={`flex-1 px-5 py-3 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer ${
                    action === "restore"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {action === "restore" ? "Bərpa edilir..." : "Silinir..."}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {getIcon()}
                      {action === "restore" ? "Bəli, bərpa et" : "Bəli, sil"}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(DeleteButton);
