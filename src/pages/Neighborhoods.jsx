import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "../components/Hero";
import ApartmentCard from "../components/ApartmentCard";
import { useApartments } from "../hooks/useApartments";

export default function Neighborhoods() {
  const [searchParams] = useSearchParams();
  const { filterApartments } = useApartments();

  const [searchLocation, setSearchLocation] = useState(
    () => searchParams.get("location") || "",
  );
  const [guestFilter, setGuestFilter] = useState(
    () => searchParams.get("guests") || "All",
  );
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Luxury", "Family", "Executive"];

  const filteredApartments = useMemo(() => {
    return filterApartments({
      location: searchLocation,
      guests: guestFilter,
      category: selectedCategory,
    });
  }, [filterApartments, searchLocation, guestFilter, selectedCategory]);

  const resetFilters = () => {
    setSearchLocation("");
    setGuestFilter("All");
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-slate-900">
      <Hero
        tag="Neighborhoods"
        title="Find the right stay in Douala’s most attractive neighborhoods."
        description="Browse curated apartments for business trips, city escapes, and longer stays with comfort, convenience, and neighborhood quality."
        locationLabel="Location or apartment"
        locationPlaceholder="Search by title or area"
        location={searchLocation}
        onLocationChange={setSearchLocation}
        guests={guestFilter}
        onGuestsChange={setGuestFilter}
        actionLabel="Reset"
        onAction={resetFilters}
      />

      {/* Category chips + results */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
              Available stays
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
              Curated apartments
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {filteredApartments.length} apartment
              {filteredApartments.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-sky-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
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

      {/* Bottom info strip */}
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
