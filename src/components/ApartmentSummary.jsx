import { formatXAF } from "../lib/format";

export default function ApartmentSummary({
  apartment,
  checkIn,
  checkOut,
  guests,
  nights,
  totalPrice,
  tag = "Your stay",
  imageHeightClass = "h-[320px]",
}) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <img
          src={apartment.image}
          alt={apartment.title}
          className={`${imageHeightClass} w-full object-cover`}
        />
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">
          {tag}
        </p>

        <h2 className="mt-3 text-2xl font-semibold">{apartment.title}</h2>

        <p className="mt-2 text-slate-600">{apartment.location}</p>

        <p className="mt-4 text-lg font-semibold text-sky-900">
          {formatXAF(apartment.price)} / night
        </p>

        <div className="mt-6 space-y-2 text-slate-600">
          <p>Check-in: {checkIn || "-"}</p>
          <p>Check-out: {checkOut || "-"}</p>
          <p>Guests: {guests}</p>
          <p>Nights: {nights}</p>
        </div>

        <div className="mt-6 flex justify-between border-t pt-4 text-lg font-semibold">
          <span>Total</span>
          <span className="text-sky-900">{formatXAF(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
