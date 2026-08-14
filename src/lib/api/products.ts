import { apiClient, unwrap, unwrapList } from "./client";
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/types/product";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";

export const productsApi = {
  list: (params?: { page?: number; pageSize?: number; companyId?: string }) =>
    unwrapList<Product>(
      apiClient.get<ApiEnvelope<PaginatedResponse<Product>>>("/products", {
        params,
      }),
    ),

  get: (id: string) =>
    unwrap<Product>(apiClient.get<ApiEnvelope<Product>>(`/products/${id}`)),

  create: (payload: CreateProductPayload) =>
    unwrap<Product>(apiClient.post<ApiEnvelope<Product>>("/products", payload)),

  update: (id: string, payload: UpdateProductPayload) =>
    unwrap<Product>(
      apiClient.patch<ApiEnvelope<Product>>(`/products/${id}`, payload),
    ),

  remove: (id: string) =>
    apiClient.delete(`/products/${id}`).then((r) => r.data),
};
