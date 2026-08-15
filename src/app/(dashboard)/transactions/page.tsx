"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/lib/api/companies";
import { transactionsApi } from "@/lib/api/transactions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";

const statusColorMap: Record<string, "success" | "warning" | "error" | "info"> =
  {
    PENDING: "warning",
    COMPLETED: "success",
    FAILED: "error",
    CANCELLED: "error",
  };

const transactionTypeColorMap: Record<
  string,
  "success" | "warning" | "error" | "info"
> = {
  PAYMENT: "info",
  REFUND: "warning",
  CREDIT: "success",
  DEBIT: "error",
  ADJUSTMENT: "info",
};

export default function TransactionsPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  const { data: companiesData } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesApi.list({ page: 1, pageSize: 50 }),
  });

  const emptyTransactions = {
    data: [],
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,
    },
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["transactions", selectedCompanyId],
    queryFn: () => {
      if (!selectedCompanyId) return emptyTransactions;
      return transactionsApi.list(selectedCompanyId, {
        page: 1,
        pageSize: 20,
      });
    },
    enabled: !!selectedCompanyId,
  });

  const companies = useMemo(() => companiesData?.data ?? [], [companiesData]);
  const transactions = useMemo(() => data?.data ?? [], [data]);

  const formatCurrency = (amount: string, currency: string) => {
    return `${currency} ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Transactions</h1>
          <p className="mt-1 text-sm text-slate-400">
            View and manage company transactions.
          </p>
        </div>

        {selectedCompanyId && (
          <Link href={`/transactions/new?companyId=${selectedCompanyId}`}>
            <Button>New transaction</Button>
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
          Pick a company to view its transactions.
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell header>Reference</TableCell>
              <TableCell header>Type</TableCell>
              <TableCell header>Amount</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Payment Method</TableCell>
              <TableCell header>Date</TableCell>
              <TableCell header>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-400">
                  Loading...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-400">
                  Error loading transactions
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-400">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">
                    {transaction.transactionReference}
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={
                        transactionTypeColorMap[transaction.transactionType]
                      }
                    >
                      {transaction.transactionType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge color={statusColorMap[transaction.status]}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-300">
                    {transaction.paymentMethod || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-slate-300">
                    {formatDate(transaction.transactionDate)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-slate-300">
                    {transaction.notes || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
