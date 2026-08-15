import { apiClient, unwrap, unwrapList } from "./client";
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionPayload,
} from "@/types/transaction";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";

export const transactionsApi = {
  list: (
    companyId: number | string,
    params?: { page?: number; pageSize?: number },
  ) =>
    unwrapList<Transaction>(
      apiClient.get<ApiEnvelope<PaginatedResponse<Transaction>>>(
        `/companies/${companyId}/transactions`,
        { params },
      ),
    ),

  get: (companyId: number | string, id: number | string) =>
    unwrap<Transaction>(
      apiClient.get<ApiEnvelope<Transaction>>(
        `/companies/${companyId}/transactions/${id}`,
      ),
    ),

  create: (companyId: number | string, payload: CreateTransactionInput) =>
    unwrap<Transaction>(
      apiClient.post<ApiEnvelope<Transaction>>(
        `/companies/${companyId}/transactions`,
        payload,
      ),
    ),

  update: (
    companyId: number | string,
    id: number | string,
    payload: UpdateTransactionPayload,
  ) =>
    unwrap<Transaction>(
      apiClient.patch<ApiEnvelope<Transaction>>(
        `/companies/${companyId}/transactions/${id}`,
        payload,
      ),
    ),

  remove: (companyId: number | string, id: number | string) =>
    apiClient.delete(`/companies/${companyId}/transactions/${id}`),
};
