import { forwardRef } from "react";
import type { AuthUser } from "@/types/auth";
import type { Company } from "@/types/company";
import type { Transaction } from "@/types/transaction";

// Same prop shape as TransactionReceipt.tsx — drop-in alternative, swap the
// import in the receipt page to switch styles.
type TransactionReceiptProps = {
  transaction: Transaction;
  user: AuthUser | null;
  hostCompany?: { name?: string; code?: string } | null;
  receiverCompany?: Company | null;
  formatCurrency: (amount: string, currency: string) => string;
  formatDate: (dateString: string) => string;
};

// Classic business-invoice layout — masthead, received-from/meta columns,
// itemized table, totals block, wet-signature lines, terms footer. Modeled
// on a standard receipt-generator template, redrawn with proper spacing,
// alignment, and hierarchy instead of the cramped, unstyled original.
export const TransactionReceiptTwo = forwardRef<
  HTMLDivElement,
  TransactionReceiptProps
>(function TransactionReceiptTwo(
  { transaction, user, hostCompany, receiverCompany, formatCurrency, formatDate },
  ref,
) {
  const preparedByName = user ? `${user.firstName} ${user.lastName}` : "—";
  const clientName = receiverCompany?.name ?? "—";

  const description =
    transaction.subscription?.productName ??
    (transaction.transactionType.charAt(0) +
      transaction.transactionType.slice(1).toLowerCase());

  const total = formatCurrency(transaction.amount, transaction.currency);
  const zero = formatCurrency("0", transaction.currency);

  return (
    <div
      ref={ref}
      className="w-full max-w-[820px] bg-white px-2 py-2 text-[#1A1A1A]"
      style={{ fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif' }}
    >
      {/* Masthead */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white"
            style={{ backgroundColor: "#4F46E5" }}
          >
            {(hostCompany?.name ?? "H").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-base font-bold leading-tight text-[#1A1A1A]">
              {hostCompany?.name ?? "Host Company"}
            </p>
            <div className="mt-1 space-y-0.5 text-xs leading-relaxed text-[#6B7280]">
              {hostCompany?.code && <p>Company code {hostCompany.code}</p>}
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold uppercase tracking-wide text-[#1A1A1A]">
            Receipt
          </p>
          <p className="mt-1 text-xs text-[#6B7280]">
            {transaction.status === "SUCCESS" || transaction.status === "COMPLETED"
              ? "Payment received"
              : transaction.status}
          </p>
        </div>
      </div>

      <div className="my-6 h-px w-full bg-[#E5E7EB]" />

      {/* Received from / meta */}
      <div className="flex justify-between gap-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">
            Received from
          </p>
          <p className="mt-2 text-sm font-semibold text-[#1A1A1A]">{clientName}</p>
          <div className="mt-1 space-y-0.5 text-xs text-[#6B7280]">
            {receiverCompany?.phone && <p>{receiverCompany.phone}</p>}
            {receiverCompany?.email && <p>{receiverCompany.email}</p>}
          </div>
        </div>

        <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1.5 text-xs">
          <dt className="text-right font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Receipt #
          </dt>
          <dd className="text-right font-mono text-[#1A1A1A]">
            {transaction.id}
          </dd>

          <dt className="text-right font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Reference
          </dt>
          <dd className="text-right font-mono text-[#1A1A1A]">
            {transaction.transactionReference}
          </dd>

          <dt className="text-right font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Payment date
          </dt>
          <dd className="text-right text-[#1A1A1A]">
            {formatDate(transaction.transactionDate)}
          </dd>

          <dt className="text-right font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Mode of payment
          </dt>
          <dd className="text-right text-[#1A1A1A]">
            {transaction.paymentMethod ?? "—"}
          </dd>
        </dl>
      </div>

      {/* Line items */}
      <table className="mt-8 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-[#1A1A1A]">
            <th className="w-8 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-[#6B7280]">
              #
            </th>
            <th className="py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Description
            </th>
            <th className="py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[#E5E7EB]">
            <td className="py-3 text-[#6B7280]">1</td>
            <td className="py-3 text-[#1A1A1A]">{description}</td>
            <td className="py-3 text-right font-mono text-[#1A1A1A]">{total}</td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-4 flex justify-end">
        <div className="w-56 space-y-1.5 text-sm">
          <div className="flex justify-between text-[#6B7280]">
            <span>Subtotal</span>
            <span className="font-mono">{total}</span>
          </div>
          <div className="flex justify-between text-[#6B7280]">
            <span>Discount</span>
            <span className="font-mono">{zero}</span>
          </div>
          <div className="flex justify-between text-[#6B7280]">
            <span>Total tax</span>
            <span className="font-mono">{zero}</span>
          </div>
          <div
            className="mt-2 flex justify-between rounded-md px-3 py-2 text-base font-bold"
            style={{ backgroundColor: "#EEF2FF", color: "#1A1A1A" }}
          >
            <span>Total</span>
            <span className="font-mono">{total}</span>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-12 grid grid-cols-2 gap-10">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">
            Client
          </p>
          <p className="mt-3 text-sm text-[#1A1A1A]">{clientName}</p>
          <div className="mt-6 border-b border-dashed border-[#9CA3AF]" />
          <p className="mt-2 text-xs text-[#9CA3AF]">
            {formatDate(transaction.transactionDate)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">
            Management
          </p>
          <p className="mt-3 text-sm text-[#1A1A1A]">{preparedByName}</p>
          <div className="mt-6 border-b border-dashed border-[#9CA3AF]" />
          <p className="mt-2 text-xs text-[#9CA3AF]">
            {formatDate(transaction.transactionDate)}
          </p>
        </div>
      </div>

      {/* Terms + footer */}
      <div className="mt-10 border-t border-[#E5E7EB] pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">
          Terms
        </p>
        <p className="mt-1.5 text-xs text-[#6B7280]">
          Payments cannot be reversed once received.
        </p>
        <p className="mt-4 text-center text-[10px] text-[#D1D5DB]">
          Generated by IAS Platform · Page 1 of 1
        </p>
      </div>
    </div>
  );
});
