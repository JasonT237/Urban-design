import { apiRequest } from "./apiClient";

export function registerUser(body) {
  return apiRequest("/auth/register", {
    method: "POST",
    body,
  });
}

export function loginUser(body) {
  return apiRequest("/auth/login", {
    method: "POST",
    body,
  });
}

export function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

export function refreshToken() {
  return apiRequest("/auth/refresh", {
    method: "POST",
  });
}
