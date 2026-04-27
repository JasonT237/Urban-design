import { useContext } from "react";
import { ApartmentsContext } from "../context/apartmentContextValue";

export function useApartments() {
  const context = useContext(ApartmentsContext);

  if (!context) {
    throw new Error("useApartments must be used inside ApartmentsProvider");
  }

  return context;
}
