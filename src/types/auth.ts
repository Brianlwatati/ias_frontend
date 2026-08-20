export interface AuthCompany {
  id: number;
  name: string;
  code: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "company_admin" | "member";
  roleCode?: string | null;
  roleName?: string | null;
  roleScopeKey?: string | null;
  companyId: string | null;
  company?: AuthCompany;
  isActive: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  companySlug?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  data: {
    user: AuthUser;
    tokens: AuthTokens;
  };
}

export interface MeResponse {
  data: {
    user: AuthUser;
  };
}
