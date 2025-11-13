"use client";

import React, { useCallback, useState } from "react";
import { message } from "antd";
import type { CheckboxChangeEvent } from "antd/lib/checkbox";
import dayjs from "dayjs";
import NoDataComponent from "@/src/app/(dashboard)/manage/_components/noData";
import { DeleteOutlined, UndoOutlined } from "@ant-design/icons";
import GlobalModal from "../../../_components/modal";
import MotionCheckbox from "../../../_components/checkbox";
import { Checkbox, Spin } from "antd";
import { useServerAction } from "@/src/hooks/useServerActions";
import {
  batchHardDelete,
  batchRestore,
  deleteAction,
} from "@/src/actions/client/delete.actions";
import { useMessageStore } from "@/src/hooks/useMessageStore";

interface Props {
  refetch: () => void;
  dataItems: any[];
  isLoading: boolean;
  isError: boolean;
}

export default function TableArea({
  refetch,
  dataItems,
  isError,
  isLoading,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<
    { documentId: string; model: string }[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { error: erroMessage, success: successMessage } = useMessageStore();
  // Restore single item
  const { mutate: restoreSingleItem, isPending: isRestoring } = useServerAction(
    async (input: { model: string; documentId: string }) => {
      return await deleteAction("restore", {
        model: input.model,
        documentId: input.documentId,
      });
    },
    {
      invalidateKeys: ["trash-items"],
      onSuccess: (result) => {
        if (result.success) {
          successMessage(result.message || "Element bərpa edildi");
          refetch();
        } else {
          erroMessage(result.error || "Xəta baş verdi");
        }
      },
      onError: () => {
        erroMessage("Element bərpa edilərkən xəta baş verdi");
      },
    }
  );

  // Hard delete single item
  const { mutate: hardDeleteSingleItem, isPending: isDeleting } =
    useServerAction(
      async (input: { model: string; documentId: string }) => {
        return await deleteAction("hard-delete", {
          model: input.model,
          documentId: input.documentId,
        });
      },
      {
        invalidateKeys: ["trash-items"],
        onSuccess: (result) => {
          if (result.success) {
            successMessage(result.message || "Element silindi");
            refetch();
          } else {
            erroMessage(result.error || "Xəta baş verdi");
          }
        },
        onError: () => {
          erroMessage("Element silinərkən xəta baş verdi");
        },
      }
    );

  // ════════════════════════════════════════════════════════════════
  // BATCH ACTIONS
  // ════════════════════════════════════════════════════════════════

  // Batch restore
  const { mutate: batchRestoreItems, isPending: isBatchRestoring } =
    useServerAction(
      async (input: {
        selectedItems: { model: string; documentId: string }[];
      }) => {
        return await batchRestore(input.selectedItems);
      },
      {
        invalidateKeys: ["trash-items"],
        onSuccess: (result) => {
          if (result.success) {
            successMessage(result.message || "Elementlər bərpa edildi");
            setIsModalVisible(false);
            setSelectedItems([]);
            refetch();
          } else {
            erroMessage(result.error || "Xəta baş verdi");
          }
        },
        onError: () => {
          erroMessage("Elementlər bərpa edilərkən xəta baş verdi");
        },
      }
    );

  // Batch hard delete
  const { mutate: batchDeleteItems, isPending: isBatchDeleting } =
    useServerAction(
      async (input: {
        selectedItems: { model: string; documentId: string }[];
      }) => {
        return await batchHardDelete(input.selectedItems);
      },
      {
        invalidateKeys: ["trash-items"],
        onSuccess: (result) => {
          if (result.success) {
            successMessage(result.message || "Elementlər silindi");
            setIsModalVisible(false);
            setSelectedItems([]);
            refetch();
          } else {
            erroMessage(result.error || "Xəta baş verdi");
          }
        },
        onError: () => {
          erroMessage("Elementlər silinərkən xəta baş verdi");
        },
      }
    );

  // ════════════════════════════════════════════════════════════════
  // HANDLERS
  // ════════════════════════════════════════════════════════════════

  const handleCheckboxChange = useCallback(
    (documentId: string, model: string, checked: boolean) => {
      setSelectedItems((prevSelected) => {
        if (checked) {
          return [...prevSelected, { documentId, model }];
        } else {
          return prevSelected.filter(
            (item) => !(item.documentId === documentId && item.model === model)
          );
        }
      });
    },
    []
  );

  const handleSelectAllChange = useCallback(
    (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
        const allItems =
          dataItems?.map((item) => ({
            documentId: item.documentId,
            model: item.model,
          })) ?? [];
        setSelectedItems(allItems);
        setIsModalVisible(allItems.length > 0);
      } else {
        setSelectedItems([]);
      }
    },
    [dataItems]
  );

  const handleIndividualAction = useCallback(
    (documentId: string, model: string, action: "restore" | "hard-delete") => {
      if (action === "restore") {
        restoreSingleItem({ model, documentId });
      } else {
        hardDeleteSingleItem({ model, documentId });
      }
    },
    [restoreSingleItem, hardDeleteSingleItem]
  );

  const handleBulkAction = useCallback(
    (action: "all-restore" | "all-delete") => {
      if (selectedItems.length === 0) {
        message.info("Heç bir element seçilməyib");
        return;
      }

      if (action === "all-restore") {
        batchRestoreItems({ selectedItems });
      } else {
        batchDeleteItems({ selectedItems });
      }
    },
    [selectedItems, batchRestoreItems, batchDeleteItems]
  );

  // ════════════════════════════════════════════════════════════════
  // COMPUTED VALUES
  // ════════════════════════════════════════════════════════════════

  const isAllSelected =
    dataItems?.length > 0 && selectedItems.length === dataItems?.length;
  const isIndeterminate = selectedItems.length > 0 && !isAllSelected;

  const isAnyPending =
    isRestoring || isDeleting || isBatchRestoring || isBatchDeleting;

  // ════════════════════════════════════════════════════════════════
  // RENDER CONDITIONS
  // ════════════════════════════════════════════════════════════════

  if (isError) {
    return (
      <div className="bg-[#fef2f2] border border-red-500 p-2.5 flex items-center justify-center font-medium text-red-600 text-base rounded-lg">
        Məlumatlar yüklənərkən xəta baş verdi
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col justify-center items-center gap-3">
          <Spin size="large" />
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!dataItems?.length) {
    return <NoDataComponent />;
  }

  // ════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ════════════════════════════════════════════════════════════════

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="min-h-10 text-left py-3 align-middle text-sm font-medium text-gray-900">
            <th className="px-4 py-3">
              <MotionCheckbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAllChange}
                isDisabled={isAnyPending}
              />
            </th>
            <th className="px-4 py-3">Başlıq</th>
            <th className="px-4 py-3">Yeniləmə tarixi</th>
            <th className="px-4 py-3">Model</th>
            <th className="px-4 py-3">Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {dataItems.map((item, index) => (
            <tr
              key={`${item.model}-${item.documentId}` || index}
              className="py-2 align-middle hover:bg-gray-50 transition-colors"
            >
              <td className="px-4">
                <Checkbox
                  checked={selectedItems.some(
                    (selectedItem) =>
                      selectedItem.documentId === item.documentId &&
                      selectedItem.model === item.model
                  )}
                  onChange={(e: CheckboxChangeEvent) =>
                    handleCheckboxChange(
                      item.documentId,
                      item.model,
                      e.target.checked
                    )
                  }
                  disabled={isAnyPending}
                />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {item?.title || "Başlıqsız"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.documentId}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">
                {item.translations?.[0]?.updatedAt
                  ? dayjs(item.translations[0].updatedAt).format(
                      "DD-MM-YYYY HH:mm:ss"
                    )
                  : "—"}
              </td>
              <td className="px-4 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {item.model}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    className="actionButton py-2 border cursor-pointer border-blue-900 text-base font-medium text-blue-900 bg-blue-50 rounded-sm hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() =>
                      handleIndividualAction(
                        item.documentId,
                        item.model,
                        "restore"
                      )
                    }
                    disabled={isAnyPending}
                  >
                    <UndoOutlined /> Bərpa
                  </button>
                  <button
                    type="button"
                    aria-label={item?.documentId}
                    className="actionButton py-2 border cursor-pointer border-red-900 text-base font-medium text-red-900 bg-red-50 rounded-sm hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() =>
                      handleIndividualAction(
                        item.documentId,
                        item.model,
                        "hard-delete"
                      )
                    }
                    disabled={isAnyPending}
                  >
                    <DeleteOutlined /> Sil
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bulk Action Modal */}
      <GlobalModal
        modalKey="bulkActionModal"
        title="Toplu Əməliyyat Təsdiqi"
        isModalOpen={isModalVisible}
        handleCloseModal={() => !isAnyPending && setIsModalVisible(false)}
      >
        <p className="font-medium text-gray-800 text-sm mb-2">
          Seçilmiş {selectedItems.length} elementi{" "}
          {selectedItems.length > 1 ? "silmək" : "bərpa etmək"} istədiyinizdən
          əminsiniz?
        </p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            type="button"
            className="bg-gray-200 cursor-pointer text-gray-800 py-2 px-4 rounded active:scale-98 transition-[150ms] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setIsModalVisible(false)}
            disabled={isAnyPending}
          >
            Ləğv et
          </button>
          <button
            className="bulkActionButton cursor-pointer bg-blue-50 border-2 rounded-sm border-blue-900 transition-colors hover:bg-blue-900 ease-in-out hover:text-white text-sm flex items-center justify-center p-3 font-medium gap-x-2 text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={() => handleBulkAction("all-restore")}
            disabled={isAnyPending}
          >
            {isBatchRestoring ? (
              <Spin size="small" />
            ) : (
              <>
                <UndoOutlined /> Bərpa et
              </>
            )}
          </button>
          <button
            className="bulkActionButton cursor-pointer bg-red-50 border-2 rounded-sm border-red-900 transition-colors hover:bg-red-900 ease-in-out hover:text-white text-sm flex items-center justify-center p-3 font-medium gap-x-2 text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={() => handleBulkAction("all-delete")}
            disabled={isAnyPending}
          >
            {isBatchDeleting ? (
              <Spin size="small" />
            ) : (
              <>
                <DeleteOutlined /> Sil
              </>
            )}
          </button>
        </div>
      </GlobalModal>
    </div>
  );
}
