import { apiClient } from "./client";
import type {
  ManagedUser,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/user";
import type { PaginatedResponse } from "@/types/api";

export const usersApi = {
  list: (params?: { page?: number; pageSize?: number; companyId?: string }) =>
    apiClient
      .get<PaginatedResponse<ManagedUser>>("/users", { params })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<ManagedUser>(`/users/${id}`).then((r) => r.data),

  create: (payload: CreateUserPayload) =>
    apiClient.post<ManagedUser>("/users", payload).then((r) => r.data),

  update: (id: string, payload: UpdateUserPayload) =>
    apiClient.patch<ManagedUser>(`/users/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete(`/users/${id}`).then((r) => r.data),
};
