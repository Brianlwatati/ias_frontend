import type { AuthUser } from "./auth";

export interface ManagedUser extends AuthUser {
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: AuthUser["role"];
  companyId?: string;
}

export interface UpdateUserPayload extends Partial<
  Omit<CreateUserPayload, "password">
> {
  status?: string;
}
