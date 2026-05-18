import { apiRequest, apiGetList, buildQueryString } from "./apiClient";

export function listAdminUsers(params = {}) {
  return apiGetList(`/admin/users${buildQueryString(params)}`);
}

export function updateUserRole(userId, role) {
  return apiRequest(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: { role },
  });
}

export function updateUserStatus(userId, is_active) {
  return apiRequest(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: { is_active },
  });
}

export function listAdminProperties(params = {}) {
  return apiGetList(`/admin/properties${buildQueryString(params)}`);
}

export function listAdminBookings(params = {}) {
  return apiGetList(`/admin/bookings${buildQueryString(params)}`);
}

export function listAdminTickets(params = {}) {
  return apiGetList(`/admin/tickets${buildQueryString(params)}`);
}

export function getAdminTicket(ticketId) {
  return apiRequest(`/admin/tickets/${ticketId}`);
}

export function replyToAdminTicket(ticketId, body) {
  return apiRequest(`/admin/tickets/${ticketId}/reply`, {
    method: "POST",
    body,
  });
}

export function updateAdminTicketStatus(ticketId, status) {
  return apiRequest(`/admin/tickets/${ticketId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function getAdminPermissions() {
  return apiRequest("/admin/permissions");
}

export function updateAdminPermissions(body) {
  return apiRequest("/admin/permissions", {
    method: "PUT",
    body,
  });
}

export function getAdminSiteConfig() {
  return apiRequest("/admin/config");
}

export function updateAdminSiteConfig(key, body) {
  return apiRequest(`/admin/config/${encodeURIComponent(key)}`, {
    method: "PUT",
    body,
  });
}

export function listAdminAuditLogs(params = {}) {
  return apiGetList(`/admin/audit-logs${buildQueryString(params)}`);
}
