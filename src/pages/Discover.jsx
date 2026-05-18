import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscoverHero from "../components/discover/DiscoverHero";
import FeaturedListings from "../components/discover/FeaturedListings";
import NeighborhoodSpotlight from "../components/discover/NeighborhoodSpotlight";
import SiteFooter from "../components/discover/SiteFooter";
import {
  featuredApartments,
  neighborhoods,
} from "../data/discoverContent";

export default function Discover() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("All");

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
