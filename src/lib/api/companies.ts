import { apiClient, unwrap, unwrapList } from "./client";
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "@/types/company";
import type { ApiEnvelope, ListEnvelope } from "@/types/api";
import type { CompanyProduct } from "@/types/company-product";

export const companiesApi = {
  list: (params?: { page?: number; pageSize?: number; search?: string }) =>
    unwrapList<Company>(
      apiClient.get<ListEnvelope<Company>>("/companies", {
        params,
      }),
    ),

  get: (id: string) =>
    unwrap<Company>(apiClient.get<ApiEnvelope<Company>>(`/companies/${id}`)),

  getCompanyProducts: (companyId: number | string) =>
    apiClient
      .get<
        ApiEnvelope<CompanyProduct[]>
      >(`/companies/${companyId}/companyproducts`)
      .then((response) => response.data.data),

  create: (payload: CreateCompanyPayload) =>
    unwrap<Company>(
      apiClient.post<ApiEnvelope<Company>>("/companies", payload),
    ),

  update: (id: string, payload: UpdateCompanyPayload) =>
    unwrap<Company>(
      apiClient.patch<ApiEnvelope<Company>>(`/companies/${id}`, payload),
    ),

  updateStatus: (
    id: string | number,
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED",
  ) =>
    unwrap<Company>(
      apiClient.patch<ApiEnvelope<Company>>(`/companies/${id}/status`, {
        status,
      }),
    ),

  assignProduct: (companyId: number | string, productId: number | string) =>
    unwrap<unknown>(
      apiClient.post<ApiEnvelope<unknown>>(
        `/companies/${companyId}/companyproducts`,
        {
          productId,
        },
      ),
    ),

  updateCompanyProductStatus: (
    companyId: number | string,
    productId: number | string,
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED",
  ) =>
    unwrap<CompanyProduct>(
      apiClient.patch<ApiEnvelope<CompanyProduct>>(
        `/companies/${companyId}/companyproducts/${productId}/status`,
        {
          status,
        },
      ),
    ),

  remove: (id: string) =>
    apiClient.delete(`/companies/${id}`).then((r) => r.data),
};
