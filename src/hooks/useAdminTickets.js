import { useContext } from "react";
import { AdminTicketContext } from "../components/adminpage/adminTicketContextValue";

export function useAdminTickets() {
  const ctx = useContext(AdminTicketContext);
  if (!ctx) {
    throw new Error("useAdminTickets must be used inside AdminTicketProvider");
  }
  return ctx;
}
