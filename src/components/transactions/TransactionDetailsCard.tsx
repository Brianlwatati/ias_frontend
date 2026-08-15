import { Badge } from "@/components/ui/Badge";
import type { Transaction } from "@/types/transaction";

type TransactionDetailsCardProps = {
  transaction: Transaction;
  statusColorMap: Record<
    string,
    "success" | "warning" | "danger" | "neutral" | "brand"
  >;
  transactionTypeColorMap: Record<
    string,
    "success" | "warning" | "danger" | "neutral" | "brand"
  >;
  formatCurrency: (amount: string, currency: string) => string;
  formatDate: (dateString: string) => string;
};

export function TransactionDetailsCard({
  transaction,
  statusColorMap,
  transactionTypeColorMap,
  formatCurrency,
  formatDate,
}: TransactionDetailsCardProps) {
  return (
    <div className="card space-y-6 w-full">
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-200">Details</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Type
            </label>
            <div className="mt-2">
              <Badge
                tone={transactionTypeColorMap[transaction.transactionType]}
              >
                {transaction.transactionType}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Amount
            </label>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Status
            </label>
            <div className="mt-2">
              <Badge tone={statusColorMap[transaction.status]}>
                {transaction.status}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Transaction Date
            </label>
            <p className="mt-2 text-sm text-slate-300">
              {formatDate(transaction.transactionDate)}
            </p>
          </div>

          {transaction.paymentMethod && (
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Payment Method
              </label>
              <p className="mt-2 text-sm text-slate-300">
                {transaction.paymentMethod}
              </p>
            </div>
          )}

          {transaction.externalTransactionId && (
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                External ID
              </label>
              <p className="mt-2 font-mono text-sm text-slate-300">
                {transaction.externalTransactionId}
              </p>
            </div>
          )}

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Created
            </label>
            <p className="mt-2 text-sm text-slate-300">
              {formatDate(transaction.createdAt)}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Updated
            </label>
            <p className="mt-2 text-sm text-slate-300">
              {formatDate(transaction.updatedAt)}
            </p>
          </div>
        </div>

        {transaction.notes && (
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Notes
            </label>
            <p className="mt-2 text-sm text-slate-300">{transaction.notes}</p>
          </div>
        )}
      </div>

      {transaction.subscription && (
        <>
          <hr className="border-surface-border" />

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-200">
              Associated Subscription
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Company
                </label>
                <p className="mt-2 text-sm text-slate-300">
                  {transaction.subscription.companyName}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Company Code
                </label>
                <p className="mt-2 font-mono text-sm text-slate-300">
                  {transaction.subscription.companyCode}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Product
                </label>
                <p className="mt-2 text-sm text-slate-300">
                  {transaction.subscription.productName}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Product Code
                </label>
                <p className="mt-2 font-mono text-sm text-slate-300">
                  {transaction.subscription.productCode}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Subscription Amount
                </label>
                <p className="mt-2 text-sm text-slate-300">
                  {formatCurrency(
                    transaction.subscription.amount,
                    transaction.subscription.currency,
                  )}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Subscription Status
                </label>
                <div className="mt-2">
                  <Badge tone="info">{transaction.subscription.status}</Badge>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Payment Status
                </label>
                <div className="mt-2">
                  <Badge tone="info">
                    {transaction.subscription.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Auto Renew
                </label>
                <p className="mt-2 text-sm text-slate-300">
                  {transaction.subscription.autoRenew ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Starts At
                </label>
                <p className="mt-2 text-sm text-slate-300">
                  {formatDate(transaction.subscription.startsAt)}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Ends At
                </label>
                <p className="mt-2 text-sm text-slate-300">
                  {formatDate(transaction.subscription.endsAt)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
