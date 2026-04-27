import { formatXAF } from "../../lib/format";

export default function ReservationPanel({
  apartment,
  checkIn,
  onCheckInChange,
  checkOut,
  onCheckOutChange,
  guests,
  onGuestsChange,
  onReserve,
}) {
  return (
    <div className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
        Reserve this stay
      </p>

      <div className="mt-4 rounded-[1.5rem] bg-[#F7F8F0] p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          Total from
        </p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">
          {formatXAF(apartment.price)}
        </p>
        <p className="mt-1 text-sm text-slate-500">per night</p>
      </div>

      <div className="mt-6 space-y-4">
        <ReservationField label="Check in">
          <input
            type="date"
            value={checkIn}
            onChange={(event) => onCheckInChange(event.target.value)}
            className="mt-2 w-full bg-transparent text-sm text-slate-800 outline-none"
          />
        </ReservationField>

        <ReservationField label="Check out">
          <input
            type="date"
            value={checkOut}
            onChange={(event) => onCheckOutChange(event.target.value)}
            className="mt-2 w-full bg-transparent text-sm text-slate-800 outline-none"
          />
        </ReservationField>

        <ReservationField label="Guests">
          <select
            value={guests}
            onChange={(event) => onGuestsChange(event.target.value)}
            className="mt-2 w-full bg-transparent text-sm text-slate-800 outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </ReservationField>
      </div>

      <button
        onClick={onReserve}
        className="mt-6 w-full rounded-full bg-sky-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-800"
      >
        Reserve now
      </button>

      <p className="mt-4 text-center text-xs text-slate-500">
        You won't be charged yet. Review details on the booking page.
      </p>
    </div>
  );
}

function ReservationField({ label, children }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 px-4 py-3">
      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}
