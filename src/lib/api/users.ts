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
          ? `/companies/${params.companyId}/users`
          : "/usercompanies",
        { params: { ...params, companyId: undefined } },
      ),
    ),

  get: (companyId: number | string, id: string | number) =>
    unwrap<ManagedUser>(
      apiClient.get<ApiEnvelope<ManagedUser>>(
        `/companies/${companyId}/users/${id}`,
      ),
    ),

  create: (companyId: number | string, payload: CreateUserPayload) =>
    unwrap<ManagedUser>(
      apiClient.post<ApiEnvelope<ManagedUser>>(
        `/companies/${companyId}/users`,
        payload,
      ),
    ),

  update: (
    companyId: number | string,
    id: string | number,
    payload: UpdateUserPayload,
  ) =>
    unwrap<ManagedUser>(
      apiClient.patch<ApiEnvelope<ManagedUser>>(
        `/companies/${companyId}/users/${id}`,
        payload,
      ),
    ),

  remove: (companyId: number | string, id: string | number) =>
    apiClient.delete(`/companies/${companyId}/users/${id}`).then((r) => r.data),
};
