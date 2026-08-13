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

    const isPublicPage =
      typeof window !== "undefined" &&
      ["/login", "/register"].some((path) =>
        window.location.pathname.startsWith(path),
      );

    if (isPublicPage) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    const token = session.getAccessToken();
    if (!token) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    setStatus("loading");
    authApi
      .me()
      .then((me) => {
        setUser(me);
        setStatus("authenticated");
      })
      .catch(() => {
        setUser(null);
        session.clear();
        setStatus("unauthenticated");
      });
  }, [status, setUser, setStatus]);

  async function login(payload: LoginPayload) {
    const {
      data: { user: loggedInUser, tokens },
    } = await authApi.login(payload);

    console.log("Logged in user:", loggedInUser);
    console.log("Tokens:", tokens);
    session.setAccessToken(tokens.accessToken);
    session.setAuthCookie();
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
