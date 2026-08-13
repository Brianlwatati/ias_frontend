import { apiClient } from "./client";
import type { AuthResponse, LoginPayload, RegisterPayload, AuthUser } from "@/types/auth";

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  logout: () => apiClient.post("/auth/logout").then((r) => r.data),

  me: () => apiClient.get<AuthUser>("/auth/me").then((r) => r.data),
};
