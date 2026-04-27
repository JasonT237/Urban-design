import { apiRequest } from "./apiClient";

export function listProperties(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.neighborhood) searchParams.set("neighborhood", params.neighborhood);
  if (params.min_price) searchParams.set("min_price", params.min_price);
  if (params.max_price) searchParams.set("max_price", params.max_price);
  if (params.bedrooms) searchParams.set("bedrooms", params.bedrooms);
  if (params.max_guests) searchParams.set("max_guests", params.max_guests);
  if (params.sort_by) searchParams.set("sort_by", params.sort_by);
  if (params.sort_order) searchParams.set("sort_order", params.sort_order);
  if (params.search) searchParams.set("search", params.search);
  if (params.page) searchParams.set("page", params.page);
  if (params.per_page) searchParams.set("per_page", params.per_page);

  const query = searchParams.toString();

  return apiRequest(`/properties${query ? `?${query}` : ""}`);
}

export function getProperty(id) {
  return apiRequest(`/properties/${id}`);
}
 