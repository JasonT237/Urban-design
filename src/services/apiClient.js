const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, value);
  });

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("access_token");
  const shouldSendToken = options.auth !== false;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(shouldSendToken && token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    console.error("API error response:", {
      status: response.status,
      payload,
    });

    throw new Error(
      payload.error?.message || payload.message || "API request failed",
    );
  }

  return payload.data;
}

/**
 * Like apiRequest but keeps pagination meta from the success envelope.
 * Use for admin (and other) list endpoints that return { data: T[], meta }.
 */
export async function apiGetList(path, options = {}) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    console.error("API error response:", {
      status: response.status,
      payload,
    });

    throw new Error(
      payload.error?.message || payload.message || "API request failed",
    );
  }

  const raw = payload.data;
  const items = Array.isArray(raw) ? raw : raw?.items ?? [];

  return { items, meta: payload.meta ?? null };
}
