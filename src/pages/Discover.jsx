import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscoverHero from "../components/discover/DiscoverHero";
import FeaturedListings from "../components/discover/FeaturedListings";
import NeighborhoodSpotlight from "../components/discover/NeighborhoodSpotlight";
import SiteFooter from "../components/discover/SiteFooter";
import { useProperties } from "../hooks/useProperties";
import { getApartmentArea } from "../lib/apartmentFilters";

function buildNeighborhoodSpotlights(apartments) {
  const neighborhoodsByName = new Map();

  apartments.forEach((apartment) => {
    const name = getApartmentArea(apartment);

    if (!name || neighborhoodsByName.has(name)) {
      return;
    }

    const availableCount = apartments.filter(
      (item) => getApartmentArea(item) === name,
    ).length;

    neighborhoodsByName.set(name, {
      id: name,
      name,
      subtitle: `${availableCount} stay${availableCount !== 1 ? "s" : ""} available`,
      image: apartment.image,
    });
  });

  return [...neighborhoodsByName.values()];
}

export default function Discover() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("All");
  const {
    properties,
    isLoading: isLoadingProperties,
    error: propertiesError,
  } = useProperties({ page: 1, per_page: 6 });
  const featuredApartments = useMemo(
    () => properties.slice(0, 2),
    [properties],
  );
  const neighborhoods = useMemo(
    () => buildNeighborhoodSpotlights(properties),
    [properties],
  );

  const openApartments = (params = {}) => {
    const searchParams = new URLSearchParams(params);
    navigate(`/apartments?${searchParams.toString()}`);
  };

  const handleSearch = () => {
    openApartments({
      ...(location.trim() && { location: location.trim() }),
      ...(guests !== "All" && { guests }),
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-slate-900">
      <DiscoverHero
        location={location}
        onLocationChange={setLocation}
        guests={guests}
        onGuestsChange={setGuests}
        onSearch={handleSearch}
      />

      <FeaturedListings
        apartments={featuredApartments}
        isLoading={isLoadingProperties}
        error={propertiesError}
        onViewAll={() => navigate("/apartments")}
        onViewApartment={(id) => navigate(`/apartments/${id}`)}
      />

      <NeighborhoodSpotlight
        neighborhoods={neighborhoods}
        onSelect={(place) => openApartments({ area: place })}
      />

      <SiteFooter />
    </div>
  );
}
