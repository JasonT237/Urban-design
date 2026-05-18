import { useContext } from "react";
import { AdminPortalContext } from "../context/adminPortalContextValue";

export function useAdminPortal() {
  const context = useContext(AdminPortalContext);
  if (!context) {
    throw new Error("useAdminPortal must be used inside AdminPortalProvider");
  }
  return context;
}
