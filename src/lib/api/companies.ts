import { apiClient } from "./client";
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "@/types/company";
import type { PaginatedResponse } from "@/types/api";

export const companiesApi = {
  list: (params?: { page?: number; pageSize?: number; search?: string }) =>
    apiClient
      .get<PaginatedResponse<Company>>("/companies", { params })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Company>(`/companies/${id}`).then((r) => r.data),

  create: (payload: CreateCompanyPayload) =>
    apiClient.post<Company>("/companies", payload).then((r) => r.data),

  update: (id: string, payload: UpdateCompanyPayload) =>
    apiClient.patch<Company>(`/companies/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete(`/companies/${id}`).then((r) => r.data),
};
