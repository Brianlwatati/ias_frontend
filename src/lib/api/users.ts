import { apiClient, unwrap, unwrapList } from "./client";
import type {
  ManagedUser,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/user";
import type { ApiEnvelope, ListEnvelope } from "@/types/api";

export const usersApi = {
  list: (params?: { page?: number; pageSize?: number; companyId?: string }) =>
    unwrapList<ManagedUser>(
      apiClient.get<ListEnvelope<ManagedUser>>(
        params?.companyId
          ? `/usercompanies/${params.companyId}/users`
          : "/usercompanies",
        { params: { ...params, companyId: undefined } },
      ),
    ),

  get: (id: string) =>
    unwrap<ManagedUser>(apiClient.get<ApiEnvelope<ManagedUser>>(`/users/${id}`)),

  create: (payload: CreateUserPayload) =>
    unwrap<ManagedUser>(
      apiClient.post<ApiEnvelope<ManagedUser>>("/users", payload),
    ),

  update: (id: string, payload: UpdateUserPayload) =>
    unwrap<ManagedUser>(
      apiClient.patch<ApiEnvelope<ManagedUser>>(`/users/${id}`, payload),
    ),

  remove: (id: string) => apiClient.delete(`/users/${id}`).then((r) => r.data),
};
