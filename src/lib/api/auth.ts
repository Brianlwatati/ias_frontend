import { apiClient } from "./client";
import { session } from "@/lib/auth/session";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  MeResponse,
} from "@/types/auth";

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  logout: () => {
    const refreshToken = session.getRefreshToken();
    return apiClient
      .post("/auth/logout", { refreshToken: refreshToken ?? "" })
      .then((r) => r.data);
  },

  me: () => apiClient.get<MeResponse>("/auth/me").then((r) => r.data.data.user),
};
