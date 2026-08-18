"use client";

import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface CompanySubscriptionProps {
  id: number;
  productName: string;
  productCode: string;
  status: string;
  amount: string;
  currency: string;
  startsAt: string;
  endsAt: string;
}

export interface CompanySubscriptionsSectionProps {
  subscriptions: CompanySubscriptionProps[];
  isLoading: boolean;
  isError: boolean;
}

export function CompanySubscriptionsSection({
  subscriptions,
  isLoading,
  isError,
}: CompanySubscriptionsSectionProps) {
  return (
    <section className="card space-y-5 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-info/10 p-2 text-info">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Subscriptions
          </h2>
          <p className="text-sm text-slate-400">
            Current subscription activity for this company
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading subscriptions…</p>
      ) : isError ? (
        <p className="text-sm text-danger">Could not load subscriptions.</p>
      ) : subscriptions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-700 p-3 text-sm text-slate-400">
          No subscriptions found for this company.
        </p>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="rounded-xl border border-slate-700 bg-slate-900/40 p-3"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium text-slate-100">
                    {subscription.productName}
                  </div>
                  <div className="text-xs text-slate-400">
                    {subscription.productCode}
                  </div>
                </div>
                <Badge
                  tone={
                    subscription.status === "ACTIVE"
                      ? "success"
                      : subscription.status === "PENDING"
                        ? "warning"
                        : subscription.status === "SUSPENDED"
                          ? "danger"
                          : "neutral"
                  }
                >
                  {subscription.status}
                </Badge>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-3">
                <div>
                  <span className="text-slate-500">Amount:</span>{" "}
                  {subscription.amount} {subscription.currency}
                </div>
                <div>
                  <span className="text-slate-500">Starts:</span>{" "}
                  {new Date(subscription.startsAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="text-slate-500">Ends:</span>{" "}
                  {new Date(subscription.endsAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
