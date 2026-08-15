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

export const TransactionReceipt = forwardRef<
  HTMLDivElement,
  TransactionReceiptProps
>(function TransactionReceipt(
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
      className="w-full max-w-[820px] rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm"
      style={{
        fontFamily: '"Segoe UI", sans-serif',
      }}
    >
      <div className="mb-8 flex items-start justify-between border-b border-slate-200 pb-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            IAS PLATFORM
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {hostCompany?.name ?? "Host Company"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {hostCompany?.code ? `Code: ${hostCompany.code}` : "Host company"}
          </p>
        </div>

        <div className="text-right text-sm text-slate-600">
          <p className="font-semibold uppercase tracking-[0.2em] text-slate-500">
            Transaction Receipt
          </p>
          <p className="mt-2 font-medium text-slate-900">
            {transaction.transactionReference}
          </p>
          <p>{printedAt}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            Issuer Details
          </p>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-medium text-slate-900">Prepared by:</span>{" "}
              {user ? `${user.firstName} ${user.lastName}` : "System admin"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Email:</span>{" "}
              {user?.email ?? "—"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Role:</span>{" "}
              {user?.role ?? "super_admin"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            Receiver Details
          </p>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-medium text-slate-900">Company:</span>{" "}
              {receiverCompany?.name ?? "Company"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Code:</span>{" "}
              {receiverCompany?.code ?? "—"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Email:</span>{" "}
              {receiverCompany?.email ?? "—"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Phone:</span>{" "}
              {receiverCompany?.phone ?? "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
          Payment Summary
        </p>
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-medium text-slate-900">Type:</span>{" "}
            {transaction.transactionType}
          </p>
          <p>
            <span className="font-medium text-slate-900">Status:</span>{" "}
            {transaction.status}
          </p>
          <p>
            <span className="font-medium text-slate-900">Amount:</span>{" "}
            {formatCurrency(transaction.amount, transaction.currency)}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full border-collapse text-left text-sm">
          <tbody>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 font-semibold text-slate-700">Field</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Value</th>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="px-4 py-3 text-slate-600">Reference</td>
              <td className="px-4 py-3 font-medium text-slate-900">
                {transaction.transactionReference}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="px-4 py-3 text-slate-600">Date</td>
              <td className="px-4 py-3 text-slate-900">
                {formatDate(transaction.transactionDate)}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="px-4 py-3 text-slate-600">Payment method</td>
              <td className="px-4 py-3 text-slate-900">
                {transaction.paymentMethod ?? "—"}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="px-4 py-3 text-slate-600">External ID</td>
              <td className="px-4 py-3 text-slate-900">
                {transaction.externalTransactionId ?? "—"}
              </td>
            </tr>
            {transaction.subscription && (
              <>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 text-slate-600">Subscription</td>
                  <td className="px-4 py-3 text-slate-900">
                    {transaction.subscription.productName}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
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
              <tr>
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
        <div className="pt-6">
          <div className="border-t border-slate-300 pt-3 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Client signature</p>
            <div className="mt-8 h-12 border-b border-slate-300" />
          </div>
        </div>

        <div className="pt-6 text-right">
          <div className="border-t border-slate-300 pt-3 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Issuer signature</p>
            <div className="mt-8 h-12 border-b border-slate-300" />
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 text-sm text-slate-600">
        <p>Generated by IAS Platform</p>
        <p className="font-bold text-slate-900">
          Total: {formatCurrency(transaction.amount, transaction.currency)}
        </p>
      </div>
    </div>
  );
});
