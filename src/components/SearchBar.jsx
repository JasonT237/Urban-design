export default function SearchBar({
  locationLabel = "Location",
  locationPlaceholder = "Search neighborhood",
  location,
  onLocationChange,
  guests,
  onGuestsChange,
  actionLabel = "Search",
  onAction,
}) {
  return (
    <div className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-[#F7F8F0] p-3 md:grid-cols-[1fr_220px_180px]">
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {locationLabel}
        </p>
        <input
          type="text"
          placeholder={locationPlaceholder}
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="mt-2 w-full bg-transparent text-sm text-slate-800 outline-none"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Guests
        </p>
        <select
          value={guests}
          onChange={(e) => onGuestsChange(e.target.value)}
          className="mt-2 w-full bg-transparent text-sm text-slate-800 outline-none"
        >
          <option value="All">All guests</option>
          <option value="1">1+ guests</option>
          <option value="2">2+ guests</option>
          <option value="4">4+ guests</option>
          <option value="6">6+ guests</option>
        </select>
      </div>

      <button
        onClick={onAction}
        className="rounded-2xl bg-sky-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
      >
        {actionLabel}
      </button>
    </div>
  );
}
