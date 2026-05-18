import { getStoredUserRole } from "./useAuthToken";

export function useUserRole() {
  const role = getStoredUserRole();

  return {
    role,
    isAdmin: role === "admin",
  };
}
