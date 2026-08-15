import { forwardRef } from "react";
import type { AuthUser } from "@/types/auth";
import type { Company } from "@/types/company";
import type { Transaction, TransactionStatus } from "@/types/transaction";

type TransactionReceiptProps = {
  transaction: Transaction;
  user: AuthUser | null;
  hostCompany?: { name?: string; code?: string } | null;
  receiverCompany?: Company | null;
  formatCurrency: (amount: string, currency: string) => string;
  formatDate: (dateString: string) => string;
};

// Ink-stamp treatment per status — deliberately deeper/more saturated than the
// app's dark-UI status colors, since this renders on white paper (in-app and
// in the exported PDF) and needs to read clearly there, not on a dark surface.
const STAMP_STYLES: Record<
  TransactionStatus,
  { label: string; color: string; border: string; wash: string }
> = {
  SUCCESS: {
    label: "PAID",
    color: "#15803D",
    border: "#15803D",
    wash: "rgba(21,128,61,0.06)",
  },
  COMPLETED: {
    label: "PAID",
    color: "#15803D",
    border: "#15803D",
    wash: "rgba(21,128,61,0.06)",
  },
  PENDING: {
    label: "PENDING",
    color: "#B45309",
    border: "#B45309",
    wash: "rgba(180,83,9,0.06)",
  },
  FAILED: {
    label: "FAILED",
    color: "#B91C1C",
    border: "#B91C1C",
    wash: "rgba(185,28,28,0.06)",
  },
  CANCELLED: {
    label: "VOID",
    color: "#64748B",
    border: "#64748B",
    wash: "rgba(100,116,139,0.06)",
  },
  REFUNDED: {
    label: "REFUNDED",
    color: "#4338CA",
    border: "#4338CA",
    wash: "rgba(67,56,202,0.06)",
  },
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

  const stamp = STAMP_STYLES[transaction.status] ?? STAMP_STYLES.PENDING;

  return (
    <div
      ref={ref}
      className="w-full max-w-[820px] bg-white text-[#0F172A]"
      style={{ fontFamily: '"Inter", "Segoe UI", sans-serif' }}
    >
      {/* Identity band */}
      <div className="flex items-start justify-between border-b-2 border-[#0F172A] pb-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#64748B]">
            IAS Platform · Official Receipt
          </p>
          <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-[#0F172A]">
            {hostCompany?.name ?? "Host Company"}
          </h1>
          {hostCompany?.code && (
            <p className="mt-1 text-xs text-[#64748B]">
              Issuer code&nbsp;
              <span className="font-mono">{hostCompany.code}</span>
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#64748B]">
            Reference
          </p>
          <p className="mt-1 font-mono text-sm font-semibold text-[#0F172A]">
            {transaction.transactionReference}
          </p>
          <p className="mt-1 text-xs text-[#94A3B8]">Printed {printedAt}</p>
        </div>
      </div>

      {/* Hero: amount is the thesis of a receipt */}
      <div className="relative mt-6 flex items-center justify-between overflow-hidden rounded-lg border border-[#E2E8F0] px-6 py-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: stamp.wash }}
        />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#64748B]">
            Amount
          </p>
          <p className="mt-1 font-mono text-4xl font-bold tracking-tight text-[#0F172A]">
            {formatCurrency(transaction.amount, transaction.currency)}
          </p>
          <p className="mt-1 text-xs text-[#64748B]">
            {transaction.transactionType} ·{" "}
            {formatDate(transaction.transactionDate)}
          </p>
        </div>

        <div
          className="relative shrink-0 select-none rounded-md border-[3px] px-4 py-2 text-center"
          style={{
            borderColor: stamp.border,
            color: stamp.color,
            transform: "rotate(-7deg)",
          }}
        >
          <span className="text-lg font-extrabold uppercase tracking-[0.15em]">
            {stamp.label}
          </span>
        </div>
      </div>

      {/* Issuer / receiver */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#64748B]">
            Prepared by
          </p>
          <div className="space-y-1 text-sm text-[#334155]">
            <p className="font-semibold text-[#0F172A]">
              {user ? `${user.firstName} ${user.lastName}` : "System admin"}
            </p>
            <p>{user?.email ?? "—"}</p>
            <p className="text-[#64748B]">{user?.role ?? "super_admin"}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#64748B]">
            Billed to
          </p>
          <div className="space-y-1 text-sm text-[#334155]">
            <p className="font-semibold text-[#0F172A]">
              {receiverCompany?.name ?? "Company"}
            </p>
            <p className="font-mono text-xs text-[#64748B]">
              {receiverCompany?.code ?? "—"}
            </p>
            <p>{receiverCompany?.email ?? "—"}</p>
            <p>{receiverCompany?.phone ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="mt-6 border-t border-[#E2E8F0]">
        <table className="w-full border-collapse text-left text-sm">
          <tbody>
            <tr className="border-b border-[#E2E8F0]">
              <td className="w-1/3 py-3 text-[#64748B]">Reference</td>
              <td className="py-3 text-right font-mono text-[#0F172A]">
                {transaction.transactionReference}
              </td>
            </tr>
            <tr className="border-b border-[#E2E8F0]">
              <td className="py-3 text-[#64748B]">Status</td>
              <td className="py-3 text-right font-medium text-[#0F172A]">
                {transaction.status}
              </td>
            </tr>
            <tr className="border-b border-[#E2E8F0]">
              <td className="py-3 text-[#64748B]">Payment method</td>
              <td className="py-3 text-right text-[#0F172A]">
                {transaction.paymentMethod ?? "—"}
              </td>
            </tr>
            {transaction.subscription && (
              <>
                <tr className="border-b border-[#E2E8F0]">
                  <td className="py-3 text-[#64748B]">Product</td>
                  <td className="py-3 text-right text-[#0F172A]">
                    {transaction.subscription.productName}
                  </td>
                </tr>
                <tr className="border-b border-[#E2E8F0]">
                  <td className="py-3 text-[#64748B]">Subscription period</td>
                  <td className="py-3 text-right text-[#0F172A]">
                    {transaction.subscription.startsAt &&
                    transaction.subscription.endsAt
                      ? `${formatDate(transaction.subscription.startsAt)} – ${formatDate(transaction.subscription.endsAt)}`
                      : "—"}
                  </td>
                </tr>
              </>
            )}
            {transaction.notes && (
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-3 align-top text-[#64748B]">Notes</td>
                <td className="py-3 text-right text-[#0F172A]">
                  {transaction.notes}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Signatures */}
      <div className="mt-10 grid grid-cols-2 gap-10">
        <div>
          <div className="h-10 border-b border-[#94A3B8]" />
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#64748B]">
            Client signature
          </p>
        </div>
        <div>
          <div className="h-10 border-b border-[#94A3B8]" />
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#64748B]">
            Issuer signature
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-[#E2E8F0] pt-4 text-xs text-[#94A3B8]">
        <p>Generated by IAS Platform · not valid without issuer signature</p>
        <p className="font-mono font-semibold text-[#0F172A]">
          Total {formatCurrency(transaction.amount, transaction.currency)}
        </p>
      </div>
    </div>
  );
});
