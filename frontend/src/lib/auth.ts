import { apiRequest } from "@/lib/apiClient";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserProfile,
} from "@/lib/types";

const TOKEN_STORAGE_KEY = "marketpulse_access_token";

export async function loginUser(payload: LoginRequest) {
  const tokenResponse = await apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });

  saveAuthToken(tokenResponse.access_token);

  return tokenResponse;
}

export async function registerUser(payload: RegisterRequest) {
  return apiRequest<UserProfile>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function getCurrentUser() {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  return apiRequest<UserProfile>("/auth/me", {
    token,
  });
}

export function saveAuthToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function clearAuthToken() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}