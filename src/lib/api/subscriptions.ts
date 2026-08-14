import { apiClient, unwrap, unwrapList } from "./client";
import type {
  Subscription,
  CreateSubscriptionPayload,
  UpdateSubscriptionPayload,
} from "@/types/subscription";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";

export const subscriptionsApi = {
  list: (
    companyId: number | string,
    params?: { page?: number; pageSize?: number },
  ) =>
    unwrapList<Subscription>(
      apiClient.get<ApiEnvelope<PaginatedResponse<Subscription>>>(
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

  remove: (companyId: number | string, id: number | string) =>
    apiClient
      .delete(`/companies/${companyId}/subscriptions/${id}`)
      .then((r) => r.data),
};
