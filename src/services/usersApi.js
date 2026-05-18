import { apiRequest, buildQueryString } from "./apiClient";

export function getCurrentUser() {
  return apiRequest("/users/me");
}

export function updateCurrentUser(body) {
  return apiRequest("/users/me", {
    method: "PATCH",
    body,
  });
}

export function changeCurrentUserPassword(body) {
  return apiRequest("/users/me/password", {
    method: "PATCH",
    body,
  });
}

export function getCurrentUserNotifications(params = {}) {
  return apiRequest(`/users/me/notifications${buildQueryString(params)}`);
}
