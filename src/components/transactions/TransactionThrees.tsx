import { forwardRef } from "react";
import type { AuthUser } from "@/types/auth";
import type { Company } from "@/types/company";
import type { Transaction, TransactionStatus } from "@/types/transaction";

// Same prop shape as TransactionReceipt.tsx / TransactionTwos.tsx — drop-in
// alternative. Swap the import in the receipt page to switch styles.
type TransactionReceiptProps = {
  transaction: Transaction;
  user: AuthUser | null;
  hostCompany?: {
    name?: string;
    code?: string;
    phone?: string;
    address?: string;
    taxId?: string;
    logoUrl?: string;
  } | null;
  receiverCompany?: Company | null;
  formatCurrency: (amount: string, currency: string) => string;
  formatDate: (dateString: string) => string;
};

const STATUS_STYLE: Record<
  TransactionStatus,
  { label: string; pill: string; pillText: string; glow: string }
> = {
  SUCCESS: {
    label: "Paid",
    pill: "#22C55E",
    pillText: "#052E14",
    glow: "rgba(34,197,94,0.35)",
  },
  COMPLETED: {
    label: "Paid",
    pill: "#22C55E",
    pillText: "#052E14",
    glow: "rgba(34,197,94,0.35)",
  },
  PENDING: {
    label: "Pending",
    pill: "#FBBF24",
    pillText: "#3A2400",
    glow: "rgba(251,191,36,0.3)",
  },
  FAILED: {
    label: "Failed",
    pill: "#F87171",
    pillText: "#450A0A",
    glow: "rgba(248,113,113,0.3)",
  },
  CANCELLED: {
    label: "Void",
    pill: "#94A3B8",
    pillText: "#0F172A",
    glow: "rgba(148,163,184,0.25)",
  },
  REFUNDED: {
    label: "Refunded",
    pill: "#A5B4FC",
    pillText: "#1E1B4B",
    glow: "rgba(165,180,252,0.3)",
  },
};

// Deterministic "barcode" bar widths derived from the reference string, so
// the same transaction always renders the same pattern (no per-render
// randomness that would look broken across screen vs. exported PDF).
function barWidths(seed: string, count: number): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const widths: number[] = [];
  for (let i = 0; i < count; i++) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    widths.push(2 + (hash % 5));
  }
  return widths;
}

// Ticket / boarding-pass silhouette: a dark hero band carrying the amount and
// status, a punched perforation line, then a light stub with the transaction
// ledger and a barcode-style flourish. Visually distinct from the ledger
// (TransactionReceipt) and classic-invoice (TransactionTwos) styles.
export const TransactionReceiptThree = forwardRef<
  HTMLDivElement,
  TransactionReceiptProps
>(function TransactionReceiptThree(
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
  const stamp = STATUS_STYLE[transaction.status] ?? STATUS_STYLE.PENDING;
  const preparedByName = user
    ? `${user.firstName} ${user.lastName}`
    : "System admin";
  const bars = barWidths(transaction.transactionReference || "IAS", 46);
  const pageBg = "#EEF0F5";

  return (
    <div
      ref={ref}
      className="w-full max-w-[560px] px-6 py-8"
      style={{
        backgroundColor: pageBg,
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
        {/* Hero */}
        <div
          className="relative overflow-hidden px-8 pb-10 pt-7 text-white"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #1E1B4B 0%, #312E81 55%, #4338CA 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
            style={{
              backgroundColor: "rgba(99,102,241,0.35)",
              filter: "blur(2px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full"
            style={{ backgroundColor: "rgba(236,72,153,0.18)" }}
          />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {hostCompany?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- rasterized by html2canvas for PDF export, next/image won't help here
                <img
                  src={hostCompany.logoUrl}
                  alt={hostCompany?.name ?? "Company logo"}
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold ring-2 ring-white/20">
                  {(hostCompany?.name ?? "H").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/60">
                  IAS Platform
                </p>
                <p className="mt-1 text-sm font-medium text-white/90">
                  {hostCompany?.name ?? "Host Company"}
                </p>
                {hostCompany?.phone && (
                  <p className="mt-0.5 text-xs text-white/50">
                    {hostCompany.phone}
                  </p>
                )}
                {hostCompany?.address && (
                  <p className="mt-0.5 text-xs leading-snug text-white/50">
                    {hostCompany.address}
                  </p>
                )}
                {hostCompany?.taxId && (
                  <p className="mt-0.5 text-xs text-white/50">
                    Tax ID {hostCompany.taxId}
                  </p>
                )}
              </div>
            </div>
            <span
              className="shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: stamp.pill, color: stamp.pillText }}
            >
              {stamp.label}
            </span>
          </div>

          <div className="relative mt-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
              Amount charged
            </p>
            <p className="mt-2 font-mono text-[44px] font-bold leading-none tracking-tight">
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
            <p className="mt-3 text-sm text-white/70">
              {transaction.subscription?.productName ??
                transaction.transactionType}{" "}
              · {formatDate(transaction.transactionDate)}
            </p>
          </div>
        </div>

        {/* Perforation */}
        <div className="relative h-0 bg-transparent">
          <div
            className="absolute left-1/2 top-0 h-px w-[calc(100%-48px)] -translate-x-1/2 border-t-2 border-dashed"
            style={{ borderColor: "rgba(15,23,42,0.18)" }}
          />
          <div
            aria-hidden
            className="absolute -left-3 -top-3 h-6 w-6 rounded-full"
            style={{ backgroundColor: pageBg }}
          />
          <div
            aria-hidden
            className="absolute -right-3 -top-3 h-6 w-6 rounded-full"
            style={{ backgroundColor: pageBg }}
          />
        </div>

        {/* Stub */}
        <div className="relative bg-white px-8 pb-8 pt-9">
          {/* Faint watermark */}
          <p
            aria-hidden
            className="pointer-events-none absolute right-4 top-10 select-none text-[64px] font-black uppercase leading-none"
            style={{
              color: "rgba(15,23,42,0.035)",
              transform: "rotate(-12deg)",
            }}
          >
            {stamp.label}
          </p>

          <div className="relative grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94A3B8]">
                Reference
              </p>
              <p className="mt-1 font-mono text-[#0F172A]">
                {transaction.transactionReference}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94A3B8]">
                Payment method
              </p>
              <p className="mt-1 text-[#0F172A]">
                {transaction.paymentMethod ?? "—"}
              </p>
            </div>
            {transaction.subscription && (
              <>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94A3B8]">
                    Product
                  </p>
                  <p className="mt-1 font-medium text-[#0F172A]">
                    {transaction.subscription.productName}
                  </p>
                  <p className="font-mono text-xs text-[#94A3B8]">
                    {transaction.subscription.productCode}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94A3B8]">
                    Subscription period
                  </p>
                  <p className="mt-1 text-[#0F172A]">
                    {transaction.subscription.startsAt &&
                    transaction.subscription.endsAt
                      ? `${formatDate(transaction.subscription.startsAt)} – ${formatDate(transaction.subscription.endsAt)}`
                      : "—"}
                  </p>
                </div>
              </>
            )}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94A3B8]">
                Billed to
              </p>
              <p className="mt-1 font-medium text-[#0F172A]">
                {receiverCompany?.name ?? "—"}
              </p>
              <p className="font-mono text-xs text-[#94A3B8]">
                {receiverCompany?.code ?? ""}
              </p>
              {receiverCompany?.email && (
                <p className="mt-0.5 text-xs text-[#94A3B8]">
                  {receiverCompany.email}
                </p>
              )}
              {receiverCompany?.phone && (
                <p className="mt-0.5 text-xs text-[#94A3B8]">
                  {receiverCompany.phone}
                </p>
              )}
              {receiverCompany?.address && (
                <p className="mt-0.5 text-xs leading-snug text-[#94A3B8]">
                  {receiverCompany.address}
                </p>
              )}
              {receiverCompany?.taxId && (
                <p className="mt-0.5 text-xs text-[#94A3B8]">
                  Tax ID {receiverCompany.taxId}
                </p>
              )}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94A3B8]">
                Prepared by
              </p>
              <p className="mt-1 font-medium text-[#0F172A]">
                {preparedByName}
              </p>
              <p className="text-xs text-[#94A3B8]">{user?.email ?? ""}</p>
            </div>
          </div>

          {transaction.notes && (
            <div className="relative mt-5 rounded-lg bg-[#F8FAFC] px-4 py-3 text-xs text-[#475569]">
              {transaction.notes}
            </div>
          )}

          {/* Barcode flourish */}
          <div className="relative mt-7 flex h-10 items-end gap-[2px]">
            {bars.map((width, index) => (
              <div
                key={index}
                className="bg-[#0F172A]"
                style={{
                  width: `${width}px`,
                  height: index % 7 === 0 ? "100%" : "60%",
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
          <p className="relative mt-2 text-center font-mono text-[10px] tracking-[0.3em] text-[#94A3B8]">
            {transaction.transactionReference}
          </p>
        </div>
      </div>

      <p className="mt-4 text-center text-[10px] text-[#94A3B8]">
        Issued by IAS Platform · not valid without a matching reference
      </p>
    </div>
  );
});
