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
import { Button } from "@/components/ui/Button";
import { TransactionDetailsCard } from "@/components/transactions/TransactionDetailsCard";
import { TransactionStatusForm } from "@/components/transactions/TransactionStatusForm";
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
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={`/transactions?companyId=${companyId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to transactions
        </Link>

        <Link
          href={`/transactions/${transactionId}/receipt?companyId=${companyId}`}
          className="inline-flex items-center"
        >
          <Button type="button" variant="secondary">
            View receipt
          </Button>
        </Link>
      </div>

      <div className="mt-8 w-full space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">
            {transaction.transactionReference}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage transaction details and status.
          </p>
        </div>

        <TransactionDetailsCard
          transaction={transaction}
          statusColorMap={statusColorMap}
          transactionTypeColorMap={transactionTypeColorMap}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />

        <hr className="border-surface-border" />

        <TransactionStatusForm
          register={register}
          errors={errors}
          currentStatus={currentStatus}
          statusColorMap={statusColorMap}
          isPending={isPending}
          companyId={companyId}
          onSubmit={handleSubmit((values) => mutate(values))}
        />
      </div>
    </>
  );
}
