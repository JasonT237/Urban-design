import SearchBar from "./SearchBar";

export default function Hero({
  tag,
  title,
  description,
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
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
            {tag}
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {description}
          </p>

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
      </div>
    </section>
  );
}
