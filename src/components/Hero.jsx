import SearchBar from "./SearchBar";
import { formatXAF } from "../lib/format";

export default function Hero({
  tag,
  title,
  description,
  stats = [],
  featuredApartment,
  locationLabel,
  locationPlaceholder, 
  location,
  onLocationChange,
  guests,
  onGuestsChange,
  actionLabel,
  onAction,
}) {
  return (
    <section className="border-b border-[#E7E8DE]">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-10">
        <div className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
              {tag}
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {description}
            </p>

            {stats.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-[#F7F8F0] p-4">
                    <p className="text-2xl font-semibold text-sky-900">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <SearchBar
                locationLabel={locationLabel}
                locationPlaceholder={locationPlaceholder}
                location={location}
                onLocationChange={onLocationChange}
                guests={guests}
                onGuestsChange={onGuestsChange}
                actionLabel={actionLabel}
                onAction={onAction}
              />
            </div>
          </div>

          {featuredApartment && (
            <div className="overflow-hidden rounded-[1.5rem] bg-[#F7F8F0]">
              <img
                src={featuredApartment.image}
                alt={featuredApartment.title}
                className="h-72 w-full object-cover lg:h-96"
              />

              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Featured stay
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {featuredApartment.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {featuredApartment.location}
                  </p>
                </div>

                <div className="shrink-0">
                  <p className="text-lg font-semibold text-sky-900">
                    {formatXAF(featuredApartment.price)}
                  </p>
                  <p className="text-sm text-slate-500">per night</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
