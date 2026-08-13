import type { AuthUser } from "./auth";

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: AuthUser["role"];
  companyId?: string;
}

export interface ManagedUser {
  id: number;
  companyId: number;
  email: string;
  systemRoleId: number;
  firstName: string;
  lastName: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface UpdateUserPayload extends Partial<
  Omit<CreateUserPayload, "password">
> {
  status?: string;
}
