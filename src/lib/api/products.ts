import { apiClient } from "./client";
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/types/product";
import type { PaginatedResponse } from "@/types/api";

export const productsApi = {
  list: (params?: { page?: number; pageSize?: number; companyId?: string }) =>
    apiClient
      .get<PaginatedResponse<Product>>("/products", { params })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Product>(`/products/${id}`).then((r) => r.data),

  create: (payload: CreateProductPayload) =>
    apiClient.post<Product>("/products", payload).then((r) => r.data),

  update: (id: string, payload: UpdateProductPayload) =>
    apiClient.patch<Product>(`/products/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete(`/products/${id}`).then((r) => r.data),
};
