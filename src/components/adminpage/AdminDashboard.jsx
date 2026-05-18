import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listAdminBookings,
  listAdminProperties,
  listAdminTickets,
  listAdminUsers,
} from "../../services/adminApi";

function StatCard({ title, value, caption, to }) {
  const content = (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      {caption && <p className="mt-2 text-sm text-slate-500">{caption}</p>}
    </div>
  );

  if (!to) return content;

  return (
    <Link
      to={to}
      className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500"
    >
      {content}
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: "-",
    properties: "-",
    bookings: "-",
    tickets: "-",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadStats() {
      setLoading(true);
      setError("");

      try {
        const [users, properties, bookings, tickets] = await Promise.all([
          listAdminUsers({ page: 1, per_page: 1 }),
          listAdminProperties({ page: 1, per_page: 1 }),
          listAdminBookings({ page: 1, per_page: 1 }),
          listAdminTickets({ page: 1, per_page: 1 }),
        ]);

        if (!ignore) {
          setStats({
            users: users.meta?.total ?? users.items.length,
            properties: properties.meta?.total ?? properties.items.length,
            bookings: bookings.meta?.total ?? bookings.items.length,
            tickets: tickets.meta?.total ?? tickets.items.length,
          });
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Could not load dashboard stats.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadStats();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Snapshot of users, properties, bookings, and support activity across
          Urban Sanctuary.
        </p>
        {error && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </p>
        )}
        {loading && !error && (
          <p className="mt-4 text-sm text-slate-500">Loading stats...</p>
        )}
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Users"
          value={stats.users}
          caption="All roles"
          to="/admin/users"
        />
        <StatCard
          title="Properties"
          value={stats.properties}
          caption="Including drafts"
          to="/admin/properties"
        />
        <StatCard
          title="Bookings"
          value={stats.bookings}
          caption="System-wide"
          to="/admin/bookings"
        />
        <StatCard
          title="Open tickets"
          value={stats.tickets}
          caption="Queue depth"
          to="/admin/support"
        />
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Quick actions
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                className="font-medium text-sky-700 hover:underline"
                to="/admin/security"
              >
                Adjust RBAC matrix in Security Settings
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sky-700 hover:underline"
                to="/admin/content"
              >
                Edit marketing copy in Content Editor
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sky-700 hover:underline"
                to="/admin/support"
              >
                Resolve support tickets
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Admin workflow
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Use this console to manage listings, support requests, user access,
            and platform settings from one place.
          </p>
        </div>
      </section>
    </div>
  );
}
