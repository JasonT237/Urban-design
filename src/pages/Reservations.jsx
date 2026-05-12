import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PortalLayout from "../components/PortalLayout";
import StatusBadge from "../components/StatusBadge";
import { formatXAF } from "../lib/format";
import { getStoredUserRole } from "../hooks/useAuthToken";
import { listBookings } from "../services/bookingsApi";

const fallbackImage =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatStatus(status) {
  if (!status) return "Pending";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function normalizeBooking(booking) {
  const property = booking.property || {};
  const images = property.images || [];
  const image =
    property.image ||
    property.image_url ||
    images[0]?.url ||
    images[0] ||
    fallbackImage;

  return {
    id: booking.id,
    title: property.title || "Reserved apartment",
    location: property.address || property.neighborhood || "Douala",
    checkIn: formatDate(booking.check_in),
    checkOut: formatDate(booking.check_out),
    amount: formatXAF(booking.total_amount),
    status: formatStatus(booking.status),
    image,
  };
}

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
            <Link
              to={`/reservations/${booking.id}`}
              className="rounded-xl bg-sky-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              View Details
            </Link>

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
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const role = getStoredUserRole();
  const isAdmin = role === "admin";

  useEffect(() => {
    const getBookings = async () => {
      setIsLoadingBookings(true);
      setBookingsError("");

      try {
        const data = await listBookings({ page: 1, per_page: 20 });
        setBookings(data.map(normalizeBooking));
      } catch (error) {
        console.error(error);
        setBookingsError(error.message);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    getBookings();
  }, []);

  return (
    <PortalLayout active="history">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">
              Reservations
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
              {isAdmin ? "All booking history" : "Booking history"}
            </h1>
            <p className="mt-3 text-slate-600">
              {isAdmin
                ? "View all guest reservations from the admin booking API."
                : "View your past, upcoming, and cancelled reservations in one place."}
            </p>
          </div>

          <button className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            Filter Bookings
          </button>
        </div>

        {isLoadingBookings && (
          <p className="mt-8 text-slate-600">Loading bookings...</p>
        )}

        {bookingsError && (
          <p className="mt-8 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
            {bookingsError}
          </p>
        )}

        {!isLoadingBookings && !bookingsError && bookings.length === 0 && (
          <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-[#F7F8F0] p-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              No bookings yet
            </h2>
            <p className="mt-3 text-slate-600">
              Your real booking history will appear here after you complete a
              reservation.
            </p>
          </div>
        )}

        {!isLoadingBookings && !bookingsError && bookings.length > 0 && (
          <div className="mt-8 space-y-5">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
