import { useNavigate } from "react-router-dom";
import { useSavedApartments } from "../hooks/useSavedApartments";
import { formatAmenityLabel } from "../lib/apartmentFilters";
import { formatXAF } from "../lib/format";

export default function ApartmentCard({ apartment }) {
  const navigate = useNavigate();
  const { isApartmentSaved, toggleSavedApartment } = useSavedApartments();
  const isSaved = isApartmentSaved(apartment.id);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        <img
          src={apartment.image}
          alt={apartment.title}
          className="h-64 w-full object-cover"
        />

        {apartment.tag && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            {apartment.tag}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleSavedApartment(apartment.id)}
          aria-label={isSaved ? "Remove from saved places" : "Save apartment"}
          className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-sm shadow-sm transition ${
            isSaved
              ? "bg-sky-900 text-white hover:bg-sky-800"
              : "bg-white/95 text-slate-700 hover:bg-white"
          }`}
        >
          {isSaved ? "\u2665" : "\u2661"}
        </button>
      </div>

      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {apartment.location}
        </p>

        <h3 className="mt-3 text-xl font-semibold text-slate-900">
          {apartment.title}
        </h3>

        {apartment.description && (
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {apartment.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#F7F8F0] px-3 py-1 text-xs font-medium text-slate-600">
            {apartment.guests} Guests
          </span>
          <span className="rounded-full bg-[#F7F8F0] px-3 py-1 text-xs font-medium text-slate-600">
            {apartment.beds} Beds
          </span>
          <span className="rounded-full bg-[#F7F8F0] px-3 py-1 text-xs font-medium text-slate-600">
            {apartment.baths} Baths
          </span>
          {apartment.category && (
            <span className="rounded-full bg-[#F7F8F0] px-3 py-1 text-xs font-medium text-slate-600">
              {apartment.category}
            </span>
          )}
          {(apartment.amenities || []).slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800"
            >
              {formatAmenityLabel(amenity)}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-sky-900">
              {formatXAF(apartment.price)}
            </p>
            <p className="text-sm text-slate-500">per night</p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/apartments/${apartment.id}`)}
            className="rounded-full bg-sky-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
          >
            View stay
          </button>
        </div>
      </div>
    </div>
  );
}
