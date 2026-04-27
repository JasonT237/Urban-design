import { Link } from "react-router-dom";
import { formatXAF } from "../../lib/format";

export default function ApartmentDetailsHeader({ apartment }) {
  return (
    <section className="border-b border-[#E7E8DE]">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-10">
        <Link
          to="/apartments"
          className="text-sm font-medium text-sky-800 transition hover:text-sky-900"
        >
          &larr; Back to listings
        </Link>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
              Apartment details
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              {apartment.title}
            </h1>

            <p className="mt-3 text-base text-slate-600">
              {apartment.location}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span>4.8 rating</span>
              <span>124 reviews</span>
              <span>Highly rated stay</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                `${apartment.guests} Guests`,
                `${apartment.beds} Beds`,
                `${apartment.baths} Baths`,
                apartment.category,
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              From
            </p>
            <p className="mt-2 text-2xl font-semibold text-sky-900">
              {formatXAF(apartment.price)}
            </p>
            <p className="text-sm text-slate-500">per night</p>
          </div>
        </div>
      </div>
    </section>
  );
}
