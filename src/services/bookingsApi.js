import { apiRequest, buildQueryString } from "./apiClient";
import { getStoredUserRole } from "../hooks/useAuthToken";

export function listBookings(params = {}) {
  const role = getStoredUserRole();
  const basePath = role === "admin" ? "/admin/bookings" : "/users/me/bookings";

  return apiRequest(`${basePath}${buildQueryString(params)}`);
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

export function cancelBooking(id) {
  return apiRequest(`/bookings/${id}/cancel`, {
    method: "POST",
  });
}
