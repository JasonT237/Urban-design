import { formatXAF } from "../../lib/format";

function FeaturedApartmentCard({ apartment, onView }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <img
        src={apartment.image}
        alt={apartment.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {apartment.location}
        </p>

        <h3 className="mt-3 text-lg font-semibold text-slate-900">
          {apartment.title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {apartment.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#F7F8F0] px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-base font-semibold text-sky-900">
            {formatXAF(apartment.price)}
            <span className="text-sm font-medium text-slate-500"> / night</span>
          </p>

          <button
            onClick={onView}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-900 text-sm text-white transition hover:bg-sky-800"
            aria-label={`View ${apartment.title}`}
            type="button"
          >
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

function HostCta() {
  return (
    <div className="flex flex-col justify-between rounded-[1.75rem] bg-sky-900 p-6 text-white shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-sky-100">
          Host with us
        </p>
        <h3 className="mt-3 text-2xl font-semibold leading-snug">
          List your property in Douala
        </h3>
        <p className="mt-4 text-sm leading-6 text-sky-100">
          Join our curated collection of premium stays. Earn from travelers looking
          for comfort, reliability, and neighborhood charm.
        </p>
      </div>

      <button className="mt-8 w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-slate-100">
        Partner with us
      </button>
    </div>
  );
}

export default function FeaturedListings({ apartments, onViewAll, onViewApartment }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
            Featured listings
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Stays selected for today
          </h2>
        </div>

        <button
          onClick={onViewAll}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          View all
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr_0.9fr]">
        {apartments.map((apartment) => (
          <FeaturedApartmentCard
            key={apartment.id}
            apartment={apartment}
            onView={() => onViewApartment(apartment.id)}
          />
        ))}

        <HostCta />
      </div>
    </section>
  );
}
