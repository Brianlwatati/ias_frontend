export interface CreateUserPayload {
  companyId: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  systemRoleId: number;
}

export interface ManagedUser {
  id: number;
  companyId: number;
  email: string;
  phone: string;
  systemRoleId: number;
  firstName: string;
  lastName: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  emailVerifiedAt?: string | null;
  roleCode?: string | null;
  roleName?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface UpdateUserPayload extends Partial<
  Omit<CreateUserPayload, "password" | "companyId">
> {
  status?: string;
}
