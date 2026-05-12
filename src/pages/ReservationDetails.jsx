import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import StatusBadge from "../components/StatusBadge";
import { formatXAF } from "../lib/format";
import { getBooking } from "../services/bookingsApi";

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

function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#F7F8F0] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function ReservationDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [isLoadingBooking, setIsLoadingBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const loadBooking = async () => {
      setIsLoadingBooking(true);
      setBookingError("");

      try {
        const data = await getBooking(id);
        setBooking(data);
      } catch (error) {
        console.error(error);
        setBookingError(error.message);
      } finally {
        setIsLoadingBooking(false);
      }
    };

    loadBooking();
  }, [id]);

  if (isLoadingBooking) {
    return (
      <div className="min-h-screen bg-[#F7F8F0] px-6 py-16 text-center text-slate-600">
        Loading reservation...
      </div>
    );
  }

  if (bookingError) {
    return (
      <NotFound
        tag="Reservation"
        title="Reservation not found"
        description={bookingError}
        backTo="/history"
        backLabel="Back to reservations"
      />
    );
  }

  if (!booking) {
    return null;
  }

  const property = booking.property || {};
  const guest = booking.guest || {};
  const images = property.images || [];
  const image =
    property.image || property.image_url || images[0]?.url || images[0] || fallbackImage;

  return (
    <div className="min-h-screen bg-[#F7F8F0] px-4 py-10 text-slate-900 md:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/history"
          className="text-sm font-semibold text-sky-800 transition hover:text-sky-900"
        >
          Back to reservations
        </Link>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <img
              src={image}
              alt={property.title || "Reservation property"}
              className="h-80 w-full object-cover lg:h-full"
            />

            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">
                    Reservation details
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
                    {property.title || "Reserved apartment"}
                  </h1>
                  <p className="mt-3 text-slate-600">
                    {property.address || property.neighborhood || "Douala"}
                  </p>
                </div>

                <StatusBadge status={formatStatus(booking.status)} />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <DetailItem label="Check-in" value={formatDate(booking.check_in)} />
                <DetailItem label="Check-out" value={formatDate(booking.check_out)} />
                <DetailItem label="Nights" value={booking.nights || 0} />
                <DetailItem
                  label="Guests"
                  value={booking.guests_count || booking.guests || 1}
                />
                <DetailItem label="Base amount" value={formatXAF(booking.base_amount)} />
                <DetailItem label="Total amount" value={formatXAF(booking.total_amount)} />
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Guest
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {[guest.first_name, guest.last_name].filter(Boolean).join(" ") ||
                    guest.email ||
                    "Guest details unavailable"}
                </p>
                {guest.email && (
                  <p className="mt-1 text-sm text-slate-600">{guest.email}</p>
                )}
                {guest.phone && (
                  <p className="mt-1 text-sm text-slate-600">{guest.phone}</p>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-sky-900 p-5 text-white">
                <p className="text-sm text-sky-100">Reservation ID</p>
                <p className="mt-2 break-all text-sm font-semibold">{booking.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
