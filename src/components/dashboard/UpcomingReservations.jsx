import { Link } from "react-router-dom";
import StatusBadge from "../StatusBadge";

export default function UpcomingReservations({ reservations }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">
          Upcoming Reservations
        </h2>
        <Link
          to="/history"
          className="text-sm font-medium text-sky-800 hover:text-sky-900"
        >
          View all
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {reservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
    </div>
  );
}

function ReservationCard({ reservation }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[#F7F8F0]">
      <div className="grid grid-cols-[120px_1fr]">
        <img
          src={reservation.image}
          alt={reservation.title}
          className="h-full w-full object-cover"
        />

        <div className="p-4">
          <StatusBadge status={reservation.status} />
          <h3 className="mt-3 text-lg font-semibold text-slate-900">
            {reservation.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{reservation.location}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
            <ReservationDate label="Check-in" value={reservation.checkIn} />
            <ReservationDate label="Check-out" value={reservation.checkOut} />
          </div>

          <div className="mt-4 flex gap-4 text-sm font-medium">
            <button className="text-sky-800 hover:text-sky-900">
              Manage Booking
            </button>
            <button className="text-red-500 hover:text-red-600">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReservationDate({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
