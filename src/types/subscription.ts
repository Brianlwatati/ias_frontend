export type SubscriptionStatus =
  | "PENDING"
  | "ACTIVE"
  | "PAST_DUE"
  | "SUSPENDED"
  | "CANCELLED"
  | "EXPIRED";

export type SubscriptionPaymentStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERPAID";

export interface Subscription {
  id: number;
  companyProductId: number;
  companyId: number;
  companyName: string;
  companyCode: string;
  productId: number;
  productName: string;
  productCode: string;
  status: SubscriptionStatus;
  amount: string;
  currency: string;
  startsAt: string;
  endsAt: string;
  autoRenew: boolean | number;
  paymentStatus: SubscriptionPaymentStatus;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPayload {
  companyProductId: number;
  amount: string;
  currency: string;
  startsAt: string;
  endsAt: string;
  autoRenew: boolean;
}

export interface UpdateSubscriptionPayload extends Partial<CreateSubscriptionPayload> {
  status?: SubscriptionStatus;
  paymentStatus?: SubscriptionPaymentStatus;
  cancellationReason?: string | null;
}
