"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ApiError } from "@/types/api";

const statusOptions = [
  "PENDING",
  "ACTIVE",
  "PAST_DUE",
  "SUSPENDED",
  "CANCELLED",
  "EXPIRED",
] as const;

const paymentStatusOptions = [
  "UNPAID",
  "PARTIALLY_PAID",
  "PAID",
  "OVERPAID",
] as const;

const subscriptionStatusUpdateSchema = z.object({
  status: z.enum(statusOptions),
  paymentStatus: z.enum(paymentStatusOptions),
});

type SubscriptionStatusUpdateForm = z.infer<
  typeof subscriptionStatusUpdateSchema
>;

const statusToneMap: Record<
  string,
  "success" | "warning" | "danger" | "neutral" | "brand"
> = {
  PENDING: "brand",
  ACTIVE: "success",
  PAST_DUE: "warning",
  SUSPENDED: "danger",
  CANCELLED: "neutral",
  EXPIRED: "neutral",
};

const paymentStatusToneMap: Record<
  string,
  "success" | "warning" | "danger" | "neutral" | "brand"
> = {
  UNPAID: "neutral",
  PARTIALLY_PAID: "warning",
  PAID: "success",
  OVERPAID: "brand",
};

function SubscriptionDetailContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId") ?? "";
  const subscriptionId = params.id as string;

  const {
    data: subscription,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["subscription", companyId, subscriptionId],
    queryFn: () => subscriptionsApi.get(companyId, subscriptionId),
    enabled: !!companyId && !!subscriptionId,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SubscriptionStatusUpdateForm>({
    resolver: zodResolver(subscriptionStatusUpdateSchema),
    defaultValues: {
      status: subscription?.status ?? "PENDING",
      paymentStatus: subscription?.paymentStatus ?? "UNPAID",
    },
    values: subscription
      ? {
          status: subscription.status,
          paymentStatus: subscription.paymentStatus,
        }
      : undefined,
  });

  const currentStatus = watch("status");
  const currentPaymentStatus = watch("paymentStatus");

  const { mutate, isPending } = useMutation({
    mutationFn: (values: SubscriptionStatusUpdateForm) =>
      subscriptionsApi.updateStatusAndPaymentStatus(companyId, subscriptionId, {
        paymentStatus: values.paymentStatus,
        status: values.status,
      }),
    onSuccess: () => {
      toast.success("Subscription updated");
      router.push(`/subscriptions?companyId=${companyId}`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Could not update subscription status");
    },
  });

  if (!companyId) {
    return (
      <div className="max-w-xl space-y-4">
        <p className="text-slate-400">Company ID is required.</p>
        <Link href="/subscriptions">
          <Button type="button" variant="secondary">
            Back to subscriptions
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-xl space-y-4">
        <p className="text-slate-400">Loading subscription...</p>
      </div>
    );
  }

  if (isError || !subscription) {
    return (
      <div className="max-w-xl space-y-4">
        <p className="text-slate-400">Subscription not found.</p>
        <Link href={`/subscriptions?companyId=${companyId}`}>
          <Button type="button" variant="secondary">
            Back to subscriptions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={`/subscriptions?companyId=${companyId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to subscriptions
        </Link>
      </div>

      <div className="mt-8 w-full space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">
            {subscription.productName}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage subscription status and payment status.
          </p>
        </div>

        <div className="card space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-400">Status:</span>
            <Badge tone={statusToneMap[currentStatus ?? subscription.status]}>
              {currentStatus ?? subscription.status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-400">Payment status:</span>
            <Badge
              tone={
                paymentStatusToneMap[
                  currentPaymentStatus ?? subscription.paymentStatus
                ]
              }
            >
              {currentPaymentStatus ?? subscription.paymentStatus}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="status"
                className="text-sm font-medium text-slate-300"
              >
                Subscription status
              </label>
              <select id="status" className="input" {...register("status")}>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-xs text-danger">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="paymentStatus"
                className="text-sm font-medium text-slate-300"
              >
                Payment status
              </label>
              <select
                id="paymentStatus"
                className="input"
                {...register("paymentStatus")}
              >
                {paymentStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.paymentStatus && (
                <p className="text-xs text-danger">
                  {errors.paymentStatus.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Company</p>
              <p className="mt-1 font-medium text-slate-100">
                {subscription.companyName}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Amount</p>
              <p className="mt-1 font-medium text-slate-100">
                {subscription.amount} {subscription.currency}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Starts</p>
              <p className="mt-1 font-medium text-slate-100">
                {new Date(subscription.startsAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Ends</p>
              <p className="mt-1 font-medium text-slate-100">
                {new Date(subscription.endsAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href={`/subscriptions?companyId=${companyId}`}>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button
            type="button"
            onClick={handleSubmit((values) => mutate(values))}
            disabled={isPending}
          >
            {isPending ? "Updating…" : "Update subscription"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default function SubscriptionDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl space-y-6" />}>
      <SubscriptionDetailContent />
    </Suspense>
  );
}
