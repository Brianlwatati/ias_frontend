import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type TransactionStatusFormProps = {
  register: UseFormRegister<{
    status: "PENDING" | "CANCELLED" | "SUCCESS" | "FAILED" | "REFUNDED";
  }>;
  errors: FieldErrors<{
    status: "PENDING" | "CANCELLED" | "SUCCESS" | "FAILED" | "REFUNDED";
  }>;
  currentStatus: "PENDING" | "CANCELLED" | "SUCCESS" | "FAILED" | "REFUNDED";
  statusColorMap: Record<
    string,
    "success" | "warning" | "danger" | "neutral" | "brand"
  >;
  isPending: boolean;
  companyId: string;
  onSubmit: () => void;
};

export function TransactionStatusForm({
  register,
  errors,
  currentStatus,
  statusColorMap,
  isPending,
  companyId,
  onSubmit,
}: TransactionStatusFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-200">Update Status</h2>

      <div>
        <label htmlFor="status" className="text-sm font-medium text-slate-300">
          Status
        </label>
        <div className="mt-2 flex items-center gap-3">
          <select id="status" className="input flex-1" {...register("status")}>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <Badge tone={statusColorMap[currentStatus]}>{currentStatus}</Badge>
        </div>
        {errors.status && (
          <p className="mt-1 text-xs text-red-400">{errors.status.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Status"}
        </Button>
        <a href={`/transactions?companyId=${companyId}`}>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </a>
      </div>
    </form>
  );
}
