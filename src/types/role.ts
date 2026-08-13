export type RoleScope = "SYSTEM" | "PRODUCT";
export type RoleStatus = "ACTIVE" | "INACTIVE";

export interface Role {
  id: number;
  productId: number | null;
  name: string;
  code: string;
  scope: RoleScope;
  roleScopeKey: string;
  description: string | null;
  status: RoleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleInput {
  productId: number;
  name: string;
  code: string;
  scope: RoleScope;
  roleScopeKey: string;
  description?: string;
}

export interface UpdateRoleInput extends Partial<CreateRoleInput> {
  status?: RoleStatus;
}
