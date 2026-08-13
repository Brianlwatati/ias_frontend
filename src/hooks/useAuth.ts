"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { authApi } from "@/lib/api/auth";
import { session } from "@/lib/auth/session";
import type { AuthUser, LoginPayload } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  setUser: (user: AuthUser | null) => void;
  setStatus: (status: AuthState["status"]) => void;
}

// Zustand holds the in-memory auth state; session.ts holds the token itself.
// Keeping these separate means components can react to "who is logged in"
// without ever touching the raw JWT.
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
}));

export function useAuth() {
  const { user, status, setUser, setStatus } = useAuthStore();

  useEffect(() => {
    if (status !== "idle") return;
    setStatus("loading");
    authApi
      .me()
      .then((me) => {
        setUser(me);
        setStatus("authenticated");
      })
      .catch(() => {
        setUser(null);
        setStatus("unauthenticated");
      });
  }, [status, setUser, setStatus]);

  async function login(payload: LoginPayload) {
    const data = await authApi.login(payload);
    const { user: loggedInUser, tokens } = data.data;
    session.setAccessToken(tokens.accessToken);
    setUser(loggedInUser);
    setStatus("authenticated");
    return loggedInUser;
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      session.clear();
      setUser(null);
      setStatus("unauthenticated");
    }
  }

  return { user, status, login, logout };
}
