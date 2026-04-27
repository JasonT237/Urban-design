import { apiRequest } from "./apiClient";

export function getProfile() {
  return apiRequest("/users/me");
}

export function updateProfile(body) {
  return apiRequest("/users/me", {
    method: "PATCH",
    body,
  });
}
