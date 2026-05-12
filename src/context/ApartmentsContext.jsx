import { useMemo } from "react";
import { apartments as catalog } from "../data/apartments";
import { filterApartmentList } from "../lib/apartmentFilters";
import { ApartmentsContext } from "./apartmentContextValue";

export function ApartmentsProvider({ children }) {
  const value = useMemo(() => {
    const getApartmentById = (id) =>
      catalog.find((apartment) => apartment.id === Number(id));

    const filterApartments = (filters = {}) =>
      filterApartmentList(catalog, filters);

    return {
      apartments: catalog,
      getApartmentById,
      filterApartments,
    };
  }, []);

  return (
    <ApartmentsContext.Provider value={value}>
      {children}
    </ApartmentsContext.Provider>
  );
}
