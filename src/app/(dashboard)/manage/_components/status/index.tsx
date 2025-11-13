import React from "react";
type Status = "published" | "draft";
interface Props {
  status: Status;
}
import { CheckCircle2, Edit3 } from "lucide-react";

const StatusBadge = ({ status }: Props) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md ${
        status === "published"
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-amber-50 text-amber-700 border border-amber-200"
      }`}
    >
      {status === "published" ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <Edit3 className="w-3.5 h-3.5" />
      )}
      {status}
    </span>
  );
};

export default React.memo(StatusBadge);
