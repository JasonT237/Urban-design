import SearchBar from "../SearchBar";

export default function DiscoverHero({
  location,
  onLocationChange,
  guests,
  onGuestsChange,
  onSearch,
}) {
  return (
    <section className="border-b border-[#E7E8DE]">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[#E7E8DE] bg-white p-6 shadow-sm md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
              Urban stays in Douala
            </p>

            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Curated stays for calm, comfort, and modern city living.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              Explore premium apartments in Douala's most attractive neighborhoods,
              with a booking experience designed to feel seamless from search to stay.
            </p>

            <div className="mt-8">
              <SearchBar
                locationLabel="Location"
                locationPlaceholder="Search neighborhood"
                location={location}
                onLocationChange={onLocationChange}
                guests={guests}
                onGuestsChange={onGuestsChange}
                actionLabel="Search"
                onAction={onSearch}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[#E7E8DE] bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80"
              alt="Modern apartment"
              className="h-full min-h-[340px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
