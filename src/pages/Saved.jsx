import { Link } from "react-router-dom";
import PortalLayout from "../components/PortalLayout";
import { useProperties } from "../hooks/useProperties";
import { useSavedApartments } from "../hooks/useSavedApartments";
import { formatXAF } from "../lib/format";

function SavedPlaceCard({ apartment, onRemove }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#F7F8F0]">
      <img
        src={apartment.image}
        alt={apartment.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {apartment.location}
        </p>

        <h2 className="mt-3 text-xl font-semibold text-slate-900">
          {apartment.title}
        </h2>

        <p className="mt-3 text-base font-semibold text-sky-900">
          {formatXAF(apartment.price)} / night
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to={`/apartments/${apartment.id}`}
            className="rounded-xl bg-sky-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
          >
            View Stay
          </Link>

          <button
            type="button"
            onClick={() => onRemove(apartment.id)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Saved() {
  const { savedApartmentIds, removeSavedApartment } = useSavedApartments();
  const {
    properties: apartments,
    isLoading,
    error,
  } = useProperties({ page: 1, per_page: 100 });

  const savedApartments = apartments.filter((apartment) =>
    savedApartmentIds.includes(String(apartment.id)),
  );
  const hasSavedIds = savedApartmentIds.length > 0;

  return (
    <PortalLayout active="saved">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">
          Saved
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
          Saved Places
        </h1>

        <p className="mt-3 text-slate-600">
          Apartments you save from the neighborhoods page will appear here.
        </p>

        {error && <p className="mt-4 text-sm text-amber-700">{error}</p>}

        {isLoading ? (
          <div className="mt-8 rounded-[1.5rem] bg-[#F7F8F0] p-8 text-center text-slate-600">
            Loading saved apartments...
          </div>
        ) : savedApartments.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {savedApartments.map((apartment) => (
              <SavedPlaceCard
                key={apartment.id}
                apartment={apartment}
                onRemove={removeSavedApartment}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.5rem] bg-[#F7F8F0] p-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              {hasSavedIds
                ? "Saved apartments are no longer available"
                : "No saved places yet"}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              {hasSavedIds
                ? "One or more saved apartment IDs were found, but the backend did not return those apartments."
                : "Go to the neighborhoods page, press the heart on an apartment card, and it will show up here."}
            </p>
            <Link
              to="/apartments"
              className="mt-6 inline-flex rounded-full bg-sky-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              Browse Apartments
            </Link>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
