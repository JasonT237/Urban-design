   import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAdminBookings } from "../../services/adminApi";
import { formatBookingDate, formatBookingStatus } from "../../lib/bookingAdapter";
import { formatXAF } from "../../lib/format";

export default function AdminBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page: 1, per_page: 50 };
      if (status) params.status = status;
      const { items } = await listAdminBookings(params);
      setBookings(items);
    } catch (err) {
      setError(err.message || "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen p-6 md:p-10">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Bookings
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            All reservations
          </h1>
          <p className="mt-2 text-slate-600">
            Review every reservation across the platform.
          </p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="cancelled">cancelled</option>
          <option value="completed">completed</option>
        </select>
      </header>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-slate-500">Loading...</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Guest / Property</th>
                <th className="px-4 py-3">Check-in</th>
                <th className="px-4 py-3">Check-out</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const guestLabel =
                  b.guest?.email ||
                  [b.guest?.first_name, b.guest?.last_name].filter(Boolean).join(" ") ||
                  "Guest";
                const propTitle = b.property?.title || "Property";
                return (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {String(b.id).slice(0, 8)}…
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{guestLabel}</p>
                      <p className="text-xs text-slate-500">{propTitle}</p>
                    </td>
                    <td className="px-4 py-3">{formatBookingDate(b.check_in)}</td>
                    <td className="px-4 py-3">{formatBookingDate(b.check_out)}</td>
                    <td className="px-4 py-3">
                      {formatXAF(b.total_amount ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium capitalize">
                      {formatBookingStatus(b.status)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/reservations/${b.id}`}
                        className="text-sky-700 hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
