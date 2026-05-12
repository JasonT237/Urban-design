import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "../components/Hero";
import ApartmentCard from "../components/ApartmentCard";
import FilterChipGroup from "../components/FilterChipGroup";
import { useApartments } from "../hooks/useApartments";
import { useProperties } from "../hooks/useProperties";
import {
  filterApartmentList,
  formatAmenityLabel,
  getApartmentAmenities,
  getApartmentCategories,
  getApartmentNeighborhoods,
} from "../lib/apartmentFilters";
import { formatXAF } from "../lib/format";

export default function Neighborhoods() {
  const [searchParams] = useSearchParams();
  const { apartments: staticApartments } = useApartments();
  const {
    properties: apiApartments,
    isLoading: isLoadingProperties,
    error: propertiesError,
  } = useProperties({ page: 1, per_page: 20 });

  const [searchLocation, setSearchLocation] = useState(
    () => searchParams.get("location") || "",
  );
  const [selectedArea, setSelectedArea] = useState(
    () => searchParams.get("area") || "",
  );
  const [guestFilter, setGuestFilter] = useState(
    () => searchParams.get("guests") || "All",
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAmenity, setSelectedAmenity] = useState(
    () => searchParams.get("amenity") || "All",
  );

  const baseApartments =
    apiApartments.length > 0 ? apiApartments : staticApartments;
  const categories = useMemo(
    () => getApartmentCategories(baseApartments),
    [baseApartments],
  );
  const availableNeighborhoods = useMemo(
    () => getApartmentNeighborhoods(baseApartments),
    [baseApartments],
  );
  const amenities = useMemo(
    () => ["All", ...getApartmentAmenities(baseApartments)],
    [baseApartments],
  );
  const activeCategory = categories.includes(selectedCategory)
    ? selectedCategory
    : "All";
  const activeAmenity = amenities.includes(selectedAmenity)
    ? selectedAmenity
    : "All";
  const filteredApartments = useMemo(() => {
    return filterApartmentList(baseApartments, {
      search: searchLocation,
      area: selectedArea,
      guests: guestFilter,
      category: activeCategory,
      amenity: activeAmenity,
    });
  }, [
    activeAmenity,
    activeCategory,
    baseApartments,
    searchLocation,
    selectedArea,
    guestFilter,
  ]);
  const heroApartment = filteredApartments[0];
  const lowestPrice = filteredApartments.reduce((lowest, apartment) => {
    if (!apartment.price) {
      return lowest;
    }

    return lowest === 0 ? apartment.price : Math.min(lowest, apartment.price);
  }, 0);
  const neighborhoods = getApartmentNeighborhoods(filteredApartments);
  const activeNeighborhood = availableNeighborhoods.find(
    (neighborhood) =>
      neighborhood.toLowerCase() === selectedArea.trim().toLowerCase(),
  );
  const heroTitle = isLoadingProperties
    ? "Loading apartments from the backend."
    : `${filteredApartments.length} apartment${
        filteredApartments.length !== 1 ? "s" : ""
      } ready for your stay in Douala.`;
  const heroDescription =
    neighborhoods.length > 0
      ? `Browse stays in ${neighborhoods.slice(0, 3).join(", ")}${
          neighborhoods.length > 3 ? ", and more" : ""
        }, with live prices, guest capacity, and apartment details coming from your backend.`
      : "Browse curated apartments for business trips, city escapes, and longer stays with comfort, convenience, and neighborhood quality.";
  const heroStats = [
    {
      label: "Available stays",
      value: isLoadingProperties ? "..." : filteredApartments.length,
    },
    {
      label: "Starting from",
      value: lowestPrice ? formatXAF(lowestPrice) : "-",
    },
    {
      label: "Neighborhoods",
      value: neighborhoods.length || "-",
    },
  ];

  const resetFilters = () => {
    setSearchLocation("");
    setSelectedArea("");
    setGuestFilter("All");
    setSelectedCategory("All");
    setSelectedAmenity("All");
  };

  const selectArea = (area) => {
    setSelectedArea(area);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-slate-900">
      <Hero
        tag="Neighborhoods"
        title={heroTitle}
        description={heroDescription}
        stats={heroStats}
        featuredApartment={heroApartment}
        locationLabel="Location or apartment"
        locationPlaceholder="Search by title or area"
        location={searchLocation}
        onLocationChange={setSearchLocation}
        guests={guestFilter}
        onGuestsChange={setGuestFilter}
        actionLabel="Reset"
        onAction={resetFilters}
      />

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-10">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
              Available stays
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
              Curated apartments
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {isLoadingProperties
                ? "Loading apartments..."
                : `${filteredApartments.length} apartment${
                    filteredApartments.length !== 1 ? "s" : ""
                  } found`}
            </p>
            {propertiesError && (
              <p className="mt-2 text-sm text-amber-700">{propertiesError}</p>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <FilterChipGroup
              label="Neighborhood"
              options={["", ...availableNeighborhoods]}
              selectedOption={activeNeighborhood || ""}
              onSelect={selectArea}
              getOptionLabel={(option) => option || "All neighborhoods"}
            />

            <FilterChipGroup
              label="Category"
              options={categories}
              selectedOption={activeCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {amenities.length > 1 && (
            <FilterChipGroup
              label="Amenities"
              options={amenities}
              selectedOption={activeAmenity}
              onSelect={setSelectedAmenity}
              getOptionLabel={(amenity) =>
                amenity === "All" ? "All amenities" : formatAmenityLabel(amenity)
              }
            />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-8 lg:px-10">
        {filteredApartments.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">
              No apartments found
            </h3>
            <p className="mt-3 text-slate-600">
              Try changing the location, guests, or category filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredApartments.map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-[#E7E8DE]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-10">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Flexible neighborhoods
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose from central, residential, and business-friendly districts
                across Douala.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Curated apartment quality
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Every stay is selected to match comfort, design quality, and a
                reliable booking experience.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Smooth reservation flow
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Move from browsing to reservation with a simple, connected user
                journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
