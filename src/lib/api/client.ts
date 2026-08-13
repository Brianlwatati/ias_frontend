import axios, {
  AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { session } from "@/lib/auth/session";
import type {
  ApiEnvelope,
  ApiError,
  ListEnvelope,
  PaginatedResponse,
} from "@/types/api";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1",
  withCredentials: true, // send the httpOnly refresh-token cookie
});

// Attach the access token to every request.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = session.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh-on-401 with a single in-flight refresh request shared across callers.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = session.getRefreshToken();
  const { data } = await axios.post<{ accessToken: string }>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    { refreshToken: refreshToken ?? "" },
    { withCredentials: true },
  );

  if (data.accessToken) {
    session.setAccessToken(data.accessToken);
  }

  return data.accessToken;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        refreshPromise ??= refreshAccessToken();
        const newToken = await refreshPromise;
        refreshPromise = null;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        session.clear();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    const apiError: ApiError = {
      message:
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        "Unexpected error",
      statusCode: error.response?.status ?? 500,
      errors: (error.response?.data as { errors?: Record<string, string[]> })
        ?.errors,
    };
    return Promise.reject(apiError);
  },
);

// Every successful ias_backend response is { success, message, data }.
// This peels off the envelope so api/* modules can just work with T.
export async function unwrap<T>(
  request: Promise<AxiosResponse<ApiEnvelope<T>>>,
): Promise<T> {
  const response = await request;
  return response.data.data;
}

// List endpoints return { success, message, data: T[], pagination }
export async function unwrapList<T>(
  request: Promise<AxiosResponse<ListEnvelope<T>>>,
): Promise<PaginatedResponse<T>> {
  const response = await request;
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
}
