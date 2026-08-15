"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { companiesApi } from "@/lib/api/companies";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { transactionsApi } from "@/lib/api/transactions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ApiError } from "@/types/api";
import type { CreateTransactionInput } from "@/types/transaction";

const transactionSchema = z.object({
  transactionType: z.enum([
    "PAYMENT",
    "REFUND",
    "CREDIT",
    "DEBIT",
    "ADJUSTMENT",
  ]),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
  subscriptionId: z.coerce.number().optional().or(z.literal("")),
  paymentMethod: z.string().optional(),
  externalTransactionId: z.string().optional(),
  notes: z.string().optional(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

export default function NewTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId") ?? "";

  const { data: companiesData } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesApi.list({ page: 1, pageSize: 50 }),
  });

  const { data: subscriptionsData, isLoading: isLoadingSubscriptions } =
    useQuery({
      queryKey: ["subscriptions", companyId],
      queryFn: () => {
        if (!companyId) return { data: [] };
        return subscriptionsApi.list(companyId, { page: 1, pageSize: 50 });
      },
      enabled: !!companyId,
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: "0.00",
      currency: "KES",
      transactionType: "PAYMENT",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: TransactionForm) => {
      const payload: CreateTransactionInput = {
        transactionType: values.transactionType,
        amount: values.amount,
        currency: values.currency,
        subscriptionId:
          values.subscriptionId && values.subscriptionId !== ""
            ? Number(values.subscriptionId)
            : undefined,
        paymentMethod: values.paymentMethod || undefined,
        externalTransactionId: values.externalTransactionId || undefined,
        notes: values.notes || undefined,
      };

      return transactionsApi.create(companyId, payload);
    },
    onSuccess: () => {
      toast.success("Transaction created");
      router.push(`/transactions?companyId=${companyId}`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not create transaction");
    },
  });

  const selectedCompany = companiesData?.data.find(
    (company) => String(company.id) === companyId,
  );

  if (!companyId) {
    return (
      <div className="max-w-xl space-y-4">
        <p className="text-slate-400">Please select a company first.</p>
        <Link href="/transactions">
          <Button type="button" variant="secondary">
            Back to transactions
          </Button>
        </Link>
      </div>
    );
  }

  if (!selectedCompany) {
    return (
      <div className="max-w-xl space-y-4">
        <p className="text-slate-400">Company not found.</p>
        <Link href="/transactions">
          <Button type="button" variant="secondary">
            Back to transactions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href={`/transactions?companyId=${companyId}`}
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to transactions
      </Link>

      <div>
        <h1 className="text-xl font-semibold text-slate-100">
          New Transaction
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Create a new transaction for {selectedCompany.name}.
        </p>
      </div>

      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="card space-y-4"
      >
        <div>
          <label
            htmlFor="transactionType"
            className="text-sm font-medium text-slate-300"
          >
            Transaction Type *
          </label>
          <select
            id="transactionType"
            className="input mt-2"
            {...register("transactionType")}
          >
            <option value="PAYMENT">Payment</option>
            <option value="REFUND">Refund</option>
            <option value="CREDIT">Credit</option>
            <option value="DEBIT">Debit</option>
            <option value="ADJUSTMENT">Adjustment</option>
          </select>
          {errors.transactionType && (
            <p className="mt-1 text-xs text-red-400">
              {errors.transactionType.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="amount"
              className="text-sm font-medium text-slate-300"
            >
              Amount *
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("amount")}
              className="mt-2"
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-400">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="currency"
              className="text-sm font-medium text-slate-300"
            >
              Currency *
            </label>
            <Input
              id="currency"
              placeholder="KES"
              {...register("currency")}
              className="mt-2"
            />
            {errors.currency && (
              <p className="mt-1 text-xs text-red-400">
                {errors.currency.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="subscriptionId"
            className="text-sm font-medium text-slate-300"
          >
            Subscription (Optional)
          </label>
          <select
            id="subscriptionId"
            className="input mt-2"
            {...register("subscriptionId")}
            disabled={isLoadingSubscriptions}
          >
            <option value="">No subscription</option>
            {subscriptionsData?.data?.map((subscription) => (
              <option key={subscription.id} value={subscription.id}>
                {subscription.productName} - {subscription.amount}{" "}
                {subscription.currency}
              </option>
            ))}
          </select>
          {errors.subscriptionId && (
            <p className="mt-1 text-xs text-red-400">
              {errors.subscriptionId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="paymentMethod"
            className="text-sm font-medium text-slate-300"
          >
            Payment Method (Optional)
          </label>
          <Input
            id="paymentMethod"
            placeholder="e.g., MOBILE, CARD, BANK"
            {...register("paymentMethod")}
            className="mt-2"
          />
          {errors.paymentMethod && (
            <p className="mt-1 text-xs text-red-400">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="externalTransactionId"
            className="text-sm font-medium text-slate-300"
          >
            External Transaction ID (Optional)
          </label>
          <Input
            id="externalTransactionId"
            placeholder="External reference ID"
            {...register("externalTransactionId")}
            className="mt-2"
          />
          {errors.externalTransactionId && (
            <p className="mt-1 text-xs text-red-400">
              {errors.externalTransactionId.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="text-sm font-medium text-slate-300">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            placeholder="Additional notes about this transaction"
            {...register("notes")}
            className="input mt-2 resize-none"
            rows={3}
          />
          {errors.notes && (
            <p className="mt-1 text-xs text-red-400">{errors.notes.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Transaction"}
          </Button>
          <Link href={`/transactions?companyId=${companyId}`}>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
