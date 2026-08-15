"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { transactionsApi } from "@/lib/api/transactions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ApiError } from "@/types/api";

const transactionTypeColorMap: Record<
  string,
  "success" | "warning" | "danger" | "neutral" | "brand"
> = {
  PAYMENT: "brand",
  REFUND: "warning",
  CREDIT: "success",
  DEBIT: "danger",
  ADJUSTMENT: "brand",
};

const statusUpdateSchema = z.object({
  status: z.enum(["PENDING", "CANCELLED", "SUCCESS", "FAILED", "REFUNDED"]),
});

type StatusUpdateForm = z.infer<typeof statusUpdateSchema>;

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const transactionId = params.id as string;
  const companyId = searchParams.get("companyId") ?? "";

  const {
    data: transaction,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transaction", companyId, transactionId],
    queryFn: () => transactionsApi.get(companyId, transactionId),
    enabled: !!companyId && !!transactionId,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StatusUpdateForm>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
      status: transaction?.status as any,
    },
    values: transaction
      ? {
          status: transaction.status as any,
        }
      : undefined,
  });

  const currentStatus = watch("status");

  const { mutate, isPending } = useMutation({
    mutationFn: (values: StatusUpdateForm) => {
      return transactionsApi.updateStatus(companyId, transactionId, {
        status: values.status,
      });
    },
    onSuccess: () => {
      toast.success("Transaction status updated");
      router.push(`/transactions?companyId=${companyId}`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not update transaction status");
    },
  });

  const statusColorMap: Record<
    string,
    "success" | "warning" | "danger" | "neutral" | "brand"
  > = {
    PENDING: "warning",
    COMPLETED: "success",
    SUCCESS: "success",
    FAILED: "danger",
    CANCELLED: "danger",
    REFUNDED: "warning",
  };

  const transactionTypeColorMap: Record<
    string,
    "success" | "warning" | "danger" | "neutral" | "brand"
  > = {
    PAYMENT: "brand",
    REFUND: "warning",
    CREDIT: "success",
    DEBIT: "danger",
    ADJUSTMENT: "brand",
  };

  const formatCurrency = (amount: string, currency: string) => {
    return `${currency} ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!companyId) {
    return (
      <div className="max-w-2xl space-y-4">
        <p className="text-slate-400">Company ID is required.</p>
        <Link href="/transactions">
          <Button type="button" variant="secondary">
            Back to transactions
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <p className="text-slate-400">Loading transaction...</p>
      </div>
    );
  }

  if (isError || !transaction) {
    return (
      <div className="max-w-2xl space-y-4">
        <p className="text-slate-400">Transaction not found.</p>
        <Link href={`/transactions?companyId=${companyId}`}>
          <Button type="button" variant="secondary">
            Back to transactions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Link
        href={`/transactions?companyId=${companyId}`}
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to transactions
      </Link>

      <div>
        <h1 className="text-xl font-semibold text-slate-100">
          {transaction.transactionReference}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage transaction details and status.
        </p>
      </div>

      <div className="card space-y-6 w-full">
        {/* Transaction Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Type
              </label>
              <div className="mt-2">
                <Badge
                  tone={transactionTypeColorMap[transaction.transactionType]}
                >
                  {transaction.transactionType}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Amount
              </label>
              <p className="mt-2 text-lg font-semibold text-slate-100">
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Status
              </label>
              <div className="mt-2">
                <Badge tone={statusColorMap[transaction.status]}>
                  {transaction.status}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Transaction Date
              </label>
              <p className="mt-2 text-sm text-slate-300">
                {formatDate(transaction.transactionDate)}
              </p>
            </div>

            {transaction.paymentMethod && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Payment Method
                </label>
                <p className="mt-2 text-sm text-slate-300">
                  {transaction.paymentMethod}
                </p>
              </div>
            )}

            {transaction.externalTransactionId && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  External ID
                </label>
                <p className="mt-2 font-mono text-sm text-slate-300">
                  {transaction.externalTransactionId}
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Created
              </label>
              <p className="mt-2 text-sm text-slate-300">
                {formatDate(transaction.createdAt)}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Updated
              </label>
              <p className="mt-2 text-sm text-slate-300">
                {formatDate(transaction.updatedAt)}
              </p>
            </div>
          </div>

          {transaction.notes && (
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Notes
              </label>
              <p className="mt-2 text-sm text-slate-300">{transaction.notes}</p>
            </div>
          )}
        </div>

        {/* Subscription Details */}
        {transaction.subscription && (
          <>
            <hr className="border-surface-border" />

            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-200">
                Associated Subscription
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Company
                  </label>
                  <p className="mt-2 text-sm text-slate-300">
                    {transaction.subscription.companyName}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Company Code
                  </label>
                  <p className="mt-2 font-mono text-sm text-slate-300">
                    {transaction.subscription.companyCode}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Product
                  </label>
                  <p className="mt-2 text-sm text-slate-300">
                    {transaction.subscription.productName}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Product Code
                  </label>
                  <p className="mt-2 font-mono text-sm text-slate-300">
                    {transaction.subscription.productCode}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Subscription Amount
                  </label>
                  <p className="mt-2 text-sm text-slate-300">
                    {formatCurrency(
                      transaction.subscription.amount,
                      transaction.subscription.currency,
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Subscription Status
                  </label>
                  <div className="mt-2">
                    <Badge tone="info">{transaction.subscription.status}</Badge>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Payment Status
                  </label>
                  <div className="mt-2">
                    <Badge tone="info">
                      {transaction.subscription.paymentStatus}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Auto Renew
                  </label>
                  <p className="mt-2 text-sm text-slate-300">
                    {transaction.subscription.autoRenew ? "Yes" : "No"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Starts At
                  </label>
                  <p className="mt-2 text-sm text-slate-300">
                    {formatDate(transaction.subscription.startsAt)}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Ends At
                  </label>
                  <p className="mt-2 text-sm text-slate-300">
                    {formatDate(transaction.subscription.endsAt)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <hr className="border-surface-border" />

        {/* Status Update Form */}
        <form
          onSubmit={handleSubmit((values) => mutate(values))}
          className="space-y-4"
        >
          <h2 className="text-sm font-semibold text-slate-200">
            Update Status
          </h2>

          <div>
            <label
              htmlFor="status"
              className="text-sm font-medium text-slate-300"
            >
              Status
            </label>
            <div className="mt-2 flex items-center gap-3">
              <select
                id="status"
                className="input flex-1"
                {...register("status")}
              >
                <option value="PENDING">Pending</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              <Badge tone={statusColorMap[currentStatus]}>
                {currentStatus}
              </Badge>
            </div>
            {errors.status && (
              <p className="mt-1 text-xs text-red-400">
                {errors.status.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Status"}
            </Button>
            <Link href={`/transactions?companyId=${companyId}`}>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
