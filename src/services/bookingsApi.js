import { apiRequest } from "./apiClient";
import { getStoredUserRole } from "../hooks/useAuthToken";

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.status) searchParams.set("status", params.status);
  if (params.page) searchParams.set("page", params.page);
  if (params.per_page) searchParams.set("per_page", params.per_page);

  return searchParams.toString();
}

export function listBookings(params = {}) {
  const query = buildQuery(params);
  const role = getStoredUserRole();
  const path = role === "admin" ? "/admin/bookings" : "/users/me/bookings";

  return apiRequest(`${path}${query ? `?${query}` : ""}`);
}

export function listMyBookings(params = {}) {
  return listBookings(params);
}

export function getBooking(id) {
  return apiRequest(`/bookings/${id}`);
}

export function createBooking(body) {
  return apiRequest("/bookings", {
    method: "POST",
    body,
  });
}
