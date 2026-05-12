import { apiRequest } from "./apiClient";

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
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page);
  if (params.per_page) searchParams.set("per_page", params.per_page);

  const query = searchParams.toString();

  return apiRequest(`/users/me/notifications${query ? `?${query}` : ""}`);
}
