import PortalLayout from "../components/PortalLayout";
import StatusBadge from "../components/StatusBadge";

const bookings = [
  {
    id: 1,
    title: "The Horizon Suite",
    location: "Bonanjo, Douala",
    checkIn: "Oct 24, 2024",
    checkOut: "Oct 28, 2024",
    amount: "245,000 FCFA",
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Akwa Terrace Loft",
    location: "Akwa, Douala",
    checkIn: "Nov 12, 2024",
    checkOut: "Nov 15, 2024",
    amount: "180,000 FCFA",
    status: "Upcoming",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Modern City Apartment",
    location: "Bali, Douala",
    checkIn: "Sep 08, 2024",
    checkOut: "Sep 11, 2024",
    amount: "160,000 FCFA",
    status: "Cancelled",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
];

function BookingInfo({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}

function BookingCard({ booking }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[#F7F8F0]">
      <div className="grid gap-0 md:grid-cols-[220px_1fr]">
        <img
          src={booking.image}
          alt={booking.title}
          className="h-[220px] w-full object-cover md:h-full"
        />

        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <StatusBadge status={booking.status} />

              <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                {booking.title}
              </h2>
              <p className="mt-2 text-slate-600">{booking.location}</p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-sm text-slate-500">Total Paid</p>
              <p className="mt-1 text-xl font-semibold text-sky-900">
                {booking.amount}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <BookingInfo label="Check-in" value={booking.checkIn} />
            <BookingInfo label="Check-out" value={booking.checkOut} />
            <BookingInfo
              label="Reservation ID"
              value={`#${booking.id.toString().padStart(4, "0")}`}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-xl bg-sky-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800">
              View Details
            </button>

            <button className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Download Receipt
            </button>

            {booking.status === "Upcoming" && (
              <button className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Reservations() {
  return (
    <PortalLayout active="history">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">
              Reservations
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
              Booking history
            </h1>
            <p className="mt-3 text-slate-600">
              View your past, upcoming, and cancelled reservations in one place.
            </p>
          </div>

          <button className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            Filter Bookings
          </button>
        </div>

        <div className="mt-8 space-y-5">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
