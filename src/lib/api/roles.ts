import { apiClient, unwrap, unwrapList } from "./client";
import type { Role, CreateRoleInput, UpdateRoleInput } from "@/types/role";

export const rolesApi = {
  list: (params?: {
    page?: number;
    pageSize?: number;
    productId?: number;
    scope?: string;
  }) => unwrapList<Role>(apiClient.get("/roles", { params })),

  get: (id: number) => unwrap<Role>(apiClient.get(`/roles/${id}`)),

  create: (payload: CreateRoleInput) =>
    unwrap<Role>(apiClient.post("/roles", payload)),

  update: (id: number, payload: UpdateRoleInput) =>
    unwrap<Role>(apiClient.patch(`/roles/${id}`, payload)),

  remove: (id: number) => unwrap<null>(apiClient.delete(`/roles/${id}`)),
};
