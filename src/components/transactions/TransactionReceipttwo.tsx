import { forwardRef } from "react";
import type { AuthUser } from "@/types/auth";
import type { Company } from "@/types/company";
import type { Transaction } from "@/types/transaction";

type TransactionReceiptProps = {
  transaction: Transaction;
  user: AuthUser | null;
  hostCompany?: { name?: string; code?: string } | null;
  receiverCompany?: Company | null;
  formatCurrency: (amount: string, currency: string) => string;
  formatDate: (dateString: string) => string;
};

export const TransactionReceiptAlt = forwardRef<
  HTMLDivElement,
  TransactionReceiptProps
>(function TransactionReceiptAlt(
  {
    transaction,
    user,
    hostCompany,
    receiverCompany,
    formatCurrency,
    formatDate,
  },
  ref,
) {
  const printedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div
      ref={ref}
      className="w-full max-w-[820px] overflow-hidden rounded-[28px] border border-slate-200 bg-[#f8fafc] text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
      style={{
        fontFamily: '"Segoe UI", sans-serif',
      }}
    >
      <div className="bg-slate-950 px-7 py-7 text-white">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-slate-300">
              IAS Platform
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              {hostCompany?.name ?? "Host Company"}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              {hostCompany?.code
                ? `Company code: ${hostCompany.code}`
                : "Official receipt"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-300">
              Receipt
            </p>
            <p className="mt-2 text-lg font-bold text-white">
              {transaction.transactionReference}
            </p>
            <p className="text-xs text-slate-300">{printedAt}</p>
          </div>
        </div>
      </div>

      <div className="px-7 pb-7 pt-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-500">
              Issuer
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-900">
              {user ? `${user.firstName} ${user.lastName}` : "System Admin"}
            </p>
            <p className="mt-1 text-sm text-slate-600">{user?.email ?? "—"}</p>
            <p className="mt-1 text-xs text-slate-500">
              {user?.role ?? "super_admin"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#eff6ff] p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-sky-700">
              Total due
            </p>
            <p className="mt-3 text-3xl font-bold text-sky-900">
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
            <p className="mt-1 text-xs text-sky-700">{transaction.status}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-500">
              Receiver
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Company:</span>{" "}
                {receiverCompany?.name ?? "Company"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Code:</span>{" "}
                {receiverCompany?.code ?? "—"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Email:</span>{" "}
                {receiverCompany?.email ?? "—"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Phone:</span>{" "}
                {receiverCompany?.phone ?? "—"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-500">
              Summary
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Type:</span>{" "}
                {transaction.transactionType}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Method:</span>{" "}
                {transaction.paymentMethod ?? "—"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Date:</span>{" "}
                {formatDate(transaction.transactionDate)}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Reference:</span>{" "}
                {transaction.transactionReference}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <tbody>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Field
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Value
                </th>
              </tr>
              {/* <tr className="border-t border-slate-200">
                <td className="px-4 py-3 text-slate-600">External ID</td>
                <td className="px-4 py-3 text-slate-900">
                  {transaction.externalTransactionId ?? "—"}
                </td>
              </tr> */}
              {transaction.subscription && (
                <>
                  <tr className="border-t border-slate-200">
                    <td className="px-4 py-3 text-slate-600">Product Name</td>
                    <td className="px-4 py-3 text-slate-900">
                      {transaction.subscription.productName}
                    </td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="px-4 py-3 text-slate-600">
                      Subscription Duration
                    </td>
                    <td className="px-4 py-3 text-slate-900">
                      {transaction.subscription.startsAt &&
                      transaction.subscription.endsAt
                        ? `${formatDate(transaction.subscription.startsAt)} - ${formatDate(transaction.subscription.endsAt)}`
                        : "—"}
                    </td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="px-4 py-3 text-slate-600">
                      Subscription status
                    </td>
                    <td className="px-4 py-3 text-slate-900">
                      {transaction.subscription.status}
                    </td>
                  </tr>
                </>
              )}
              {transaction.notes && (
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">Notes</td>
                  <td className="px-4 py-3 text-slate-900">
                    {transaction.notes}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="border-t border-slate-300 pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Client signature
            </p>
            <div className="mt-8 h-12 border-b-2 border-slate-300" />
          </div>
          <div className="border-t border-slate-300 pt-4 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Issuer signature
            </p>
            <div className="mt-8 h-12 border-b-2 border-slate-300" />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
          <p>Generated by IAS Platform</p>
          <p className="font-semibold text-slate-900">
            Total: {formatCurrency(transaction.amount, transaction.currency)}
          </p>
        </div>
      </div>
    </div>
  );
});
