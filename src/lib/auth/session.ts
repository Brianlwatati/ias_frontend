// Thin wrapper around token storage. Access token lives in memory + localStorage
// for client-side reads; the backend should also set an httpOnly refresh cookie
// so refresh survives a hard reload without exposing the refresh token to JS.

const ACCESS_TOKEN_KEY = "ias_access_token";
const AUTH_COOKIE_NAME =
  process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ?? "ias_session";

export const session = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  setAuthCookie() {
    if (typeof document === "undefined") return;
    document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=86400; SameSite=Lax`;
  },
  clearAuthCookie() {
    if (typeof document === "undefined") return;
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.clearAuthCookie();
  },
};
