import type { Subscription } from "./subscription";

export type TransactionType =
  | "PAYMENT"
  | "REFUND"
  | "CREDIT"
  | "DEBIT"
  | "ADJUSTMENT";
export type TransactionStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "SUCCESS"
  | "REFUNDED";

export interface Transaction {
  id: number;
  companyId: number;
  subscriptionId?: number;
  transactionReference: string;
  transactionType: TransactionType;
  amount: string;
  currency: string;
  status: TransactionStatus;
  paymentMethod?: string;
  externalTransactionId?: string;
  transactionDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  subscription?: Subscription;
}

export type CreateTransactionInput = {
  transactionType: "PAYMENT" | "REFUND" | "CREDIT" | "DEBIT" | "ADJUSTMENT";
  amount: string;
  currency: string;
  subscriptionId?: number | undefined;
  paymentMethod?: string | undefined;
  externalTransactionId?: string | undefined;
  notes?: string | undefined;
};

export interface UpdateTransactionPayload extends Partial<CreateTransactionInput> {
  status?: TransactionStatus;
}

export type UpdateTransactionStatusInput = {
  status: "PENDING" | "CANCELLED" | "SUCCESS" | "FAILED" | "REFUNDED";
};
