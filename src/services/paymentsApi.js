import { apiRequest } from "./apiClient";

export function initiatePayment(body) {
  return apiRequest("/payments/initiate", {
    method: "POST",
    body,
  });
}
