import { useState } from "react";

const TOKEN_STORAGE_KEY = "access_token";

export function getStoredAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredTokenPayload() {
  const token = getStoredAuthToken();

  if (!token) {
    return null;
  }

  try {
    const [, encodedPayload] = token.split(".");

    if (!encodedPayload) {
      return null;
    }

    const normalizedPayload = encodedPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(paddedPayload));
  } catch {
    return null;
  }
}

export function getStoredUserRole() {
  return getStoredTokenPayload()?.role || null;
}

export function useAuthToken() {
  const [token, setToken] = useState(() => getStoredAuthToken());

  const saveToken = (nextToken) => {
    if (!nextToken) {
      return;
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
  };

  const clearToken = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  };

  const getAuthHeaders = () => {
    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  return {
    token,
    isAuthenticated: Boolean(token),
    role: getStoredUserRole(),
    saveToken,
    clearToken,
    getAuthHeaders,
  };
}
