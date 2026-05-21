import { apiRequest } from "./apiClient";

export function loginUser(body) {
  return apiRequest("/auth/login", {
    method: "POST",
    auth: false,
    body,
  });
}

export function registerUser(body) {
  return apiRequest("/auth/register", {
    method: "POST",
    auth: false,
    body,
  });
}

export function enableTwoFactor() {
  return apiRequest("/auth/2fa/enable", {
    method: "POST",
  });
}

export function confirmTwoFactor(body) {
  return apiRequest("/auth/2fa/confirm", {
    method: "POST",
    body,
  });
}
