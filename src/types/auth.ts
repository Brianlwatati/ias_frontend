export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "company_admin" | "member";
  companyId: string | null;
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
