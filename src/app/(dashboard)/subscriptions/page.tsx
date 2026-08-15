"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/lib/api/companies";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";

export default function SubscriptionsPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  const { data: companiesData } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesApi.list({ page: 1, pageSize: 50 }),
  });

  const emptySubscriptions = {
    data: [],
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,
    },
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["subscriptions", selectedCompanyId],
    queryFn: () => {
      if (!selectedCompanyId) return emptySubscriptions;
      return subscriptionsApi.list(selectedCompanyId, {
        page: 1,
        pageSize: 20,
      });
    },
    enabled: !!selectedCompanyId,
  });

  const companies = useMemo(() => companiesData?.data ?? [], [companiesData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">
            Subscriptions
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Current product subscriptions for each company.
          </p>
        </div>

        {selectedCompanyId && (
          <Link href={`/subscriptions/new?companyId=${selectedCompanyId}`}>
            <Button>New subscription</Button>
          </Link>
        )}
      </div>

      <div className="card space-y-4">
        <label htmlFor="company" className="text-sm font-medium text-slate-300">
          Company
        </label>
        <select
          id="company"
          className="input"
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
        >
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company.id} value={String(company.id)}>
              {company.name} ({company.code})
            </option>
          ))}
        </select>
      </div>

      {!selectedCompanyId ? (
        <div className="card text-sm text-slate-400">
          Pick a company to view its subscriptions.
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell header>Product</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Amount</TableCell>
              <TableCell header>Dates</TableCell>
              <TableCell header>Payment</TableCell>
              <TableCell header>Renew</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell>Loading subscriptions…</TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell>Could not load subscriptions.</TableCell>
              </TableRow>
            )}
            {data?.data.length === 0 && !isLoading && (
              <TableRow>
                <TableCell>No subscriptions found for this company.</TableCell>
              </TableRow>
            )}
            {data?.data.map((subscription) => (
              <Link
                key={subscription.id}
                href={`/subscriptions/${subscription.id}?companyId=${selectedCompanyId}`}
                className="contents"
              >
                <TableRow>
                  <TableCell>
                    <div>
                      <div className="font-medium text-slate-100">
                        {subscription.productName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {subscription.productCode}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        subscription.status === "ACTIVE"
                          ? "success"
                          : subscription.status === "PENDING"
                            ? "brand"
                            : subscription.status === "CANCELLED"
                              ? "neutral"
                              : subscription.status === "PAST_DUE"
                                ? "warning"
                                : subscription.status === "SUSPENDED"
                                  ? "danger"
                                  : "neutral"
                      }
                    >
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {subscription.amount} {subscription.currency}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-300">
                      {new Date(subscription.startsAt).toLocaleDateString()} -{" "}
                      {new Date(subscription.endsAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        subscription.paymentStatus === "PAID"
                          ? "success"
                          : subscription.paymentStatus === "UNPAID"
                            ? "neutral"
                            : subscription.paymentStatus === "PARTIALLY_PAID"
                              ? "warning"
                              : "brand"
                      }
                    >
                      {subscription.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{subscription.autoRenew ? "Yes" : "No"}</TableCell>
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
