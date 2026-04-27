import { Link } from "react-router-dom";
import PortalLayout from "../components/PortalLayout";

const savedPlaces = [
  {
    id: 1,
    title: "Luxury Apartment with Balcony",
    location: "Akwa, Douala",
    price: "65,000 XAF / night",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Executive City Loft",
    location: "Bonapriso, Douala",
    price: "85,000 XAF / night",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
];

function SavedPlaceCard({ place }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#F7F8F0]">
      <img
        src={place.image}
        alt={place.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {place.location}
        </p>

        <h2 className="mt-3 text-xl font-semibold text-slate-900">
          {place.title}
        </h2>

        <p className="mt-3 text-base font-semibold text-sky-900">
          {place.price}
        </p>

        <div className="mt-5 flex gap-3">
          <Link
            to={`/apartments/${place.id}`}
            className="rounded-xl bg-sky-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
          >
            View Stay
          </Link>

          <button className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Saved() {
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
          Apartments you want to revisit later will appear here.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {savedPlaces.map((place) => (
            <SavedPlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
