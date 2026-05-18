import { apiRequest, buildQueryString } from "./apiClient";

export function listProperties(params = {}) {
  return apiRequest(`/properties${buildQueryString(params)}`);
}

export function getProperty(id) {
  return apiRequest(`/properties/${id}`);
}
