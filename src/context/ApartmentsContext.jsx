import { useMemo } from "react";
import { apartments as catalog } from "../data/apartments";
import { ApartmentsContext } from "./apartmentContextValue";

export function ApartmentsProvider({ children }) {
  const value = useMemo(() => {
    const getApartmentById = (id) =>
      catalog.find((apartment) => apartment.id === Number(id));

    const filterApartments = ({
      location = "",
      guests = "All",
      category = "All",
    } = {}) => {
      const normalizedLocation = location.trim().toLowerCase();

      return catalog.filter((apartment) => {
        const matchesLocation =
          !normalizedLocation ||
          apartment.location.toLowerCase().includes(normalizedLocation) ||
          apartment.title.toLowerCase().includes(normalizedLocation);

        const matchesGuests =
          guests === "All" || apartment.guests >= Number(guests);

        const matchesCategory =
          category === "All" || apartment.category === category;

        return matchesLocation && matchesGuests && matchesCategory;
      });
    };

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
