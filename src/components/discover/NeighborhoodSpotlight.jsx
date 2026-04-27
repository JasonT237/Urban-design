export default function NeighborhoodSpotlight({ neighborhoods, onSelect }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm md:px-8">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
            Neighborhood spotlight
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Discover Douala by district
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Explore the unique personality of Douala's most iconic neighborhoods,
            from quiet residential areas to vibrant commercial hubs.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {neighborhoods.map((place) => (
            <button
              key={place.id}
              onClick={() => onSelect(place.name)}
              className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[#F7F8F0] text-left transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={place.image}
                alt={place.name}
                className="h-36 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {place.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{place.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
