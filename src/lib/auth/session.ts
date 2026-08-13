// Thin wrapper around token storage. Access token lives in memory + localStorage
// for client-side reads; the backend should also set an httpOnly refresh cookie
// so refresh survives a hard reload without exposing the refresh token to JS.

const ACCESS_TOKEN_KEY = "ias_access_token";

export const session = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
