import { apiClient, unwrap, unwrapList } from "./client";
import type {
  Subscription,
  CreateSubscriptionPayload,
  UpdateSubscriptionPayload,
  SubscriptionPaymentStatus,
  SubscriptionStatus,
} from "@/types/subscription";
import type { ApiEnvelope, ListEnvelope } from "@/types/api";

export const subscriptionsApi = {
  list: (
    companyId: number | string,
    params?: { page?: number; pageSize?: number },
  ) =>
    unwrapList<Subscription>(
      apiClient.get<ListEnvelope<Subscription>>(
        `/companies/${companyId}/subscriptions`,
        { params },
      ),
    ),

  get: (companyId: number | string, id: number | string) =>
    unwrap<Subscription>(
      apiClient.get<ApiEnvelope<Subscription>>(
        `/companies/${companyId}/subscriptions/${id}`,
      ),
    ),

  create: (companyId: number | string, payload: CreateSubscriptionPayload) =>
    unwrap<Subscription>(
      apiClient.post<ApiEnvelope<Subscription>>(
        `/companies/${companyId}/subscriptions`,
        payload,
      ),
    ),

  update: (
    companyId: number | string,
    id: number | string,
    payload: UpdateSubscriptionPayload,
  ) =>
    unwrap<Subscription>(
      apiClient.patch<ApiEnvelope<Subscription>>(
        `/companies/${companyId}/subscriptions/${id}`,
        payload,
      ),
    ),

  updateStatusAndPaymentStatus: (
    companyId: number | string,
    id: number | string,
    payload: {
      paymentStatus: SubscriptionPaymentStatus;
      status: SubscriptionStatus;
    },
  ) =>
    unwrap<Subscription>(
      apiClient.patch<ApiEnvelope<Subscription>>(
        `/companies/${companyId}/subscriptions/${id}/status-and-payment-status`,
        payload,
      ),
    ),

  remove: (companyId: number | string, id: number | string) =>
    apiClient
      .delete(`/companies/${companyId}/subscriptions/${id}`)
      .then((r) => r.data),
};
