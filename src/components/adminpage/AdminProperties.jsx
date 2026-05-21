import { useCallback, useEffect, useState } from "react";
import { formatXAF } from "../../lib/format";
import {
  listAdminProperties,
  updateAdminProperty,
} from "../../services/adminApi";

function StatusPill({ status }) {
  const tone =
    status === "published"
      ? "bg-emerald-100 text-emerald-800"
      : status === "draft"
        ? "bg-amber-100 text-amber-800"
        : "bg-slate-200 text-slate-700";

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tone}`}
    >
      {status || "No status"}
    </span>
  );
}

function PropertyStatusAction({ property, busy, onChangeStatus }) {
  const isPublished = property.status === "published";
  const nextStatus = isPublished ? "archived" : "published";

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => onChangeStatus(property.id, nextStatus)}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${
        isPublished
          ? "border border-slate-300 text-slate-700 hover:bg-slate-100"
          : "bg-sky-900 text-white hover:bg-sky-800"
      }`}
    >
      {busy ? "Updating..." : isPublished ? "Archive" : "Publish"}
    </button>
  );
}

export default function AdminProperties() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = { page: 1, per_page: 50 };
      if (status) params.status = status;

      const { items: rows } = await listAdminProperties(params);
      setItems(rows);
    } catch (err) {
      setError(err.message || "Could not load properties.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const changePropertyStatus = async (propertyId, nextStatus) => {
    setBusyId(propertyId);
    setError("");

    try {
      await updateAdminProperty(propertyId, { status: nextStatus });
      await load();
    } catch (err) {
      setError(err.message || "Could not update property status.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Property Listings
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            All properties
          </h1>
          <p className="mt-2 text-slate-600">
            Manage published, draft, and archived apartment listings.
          </p>
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="archived">archived</option>
        </select>
      </header>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-slate-500">Loading properties...</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Neighborhood</th>
                <th className="px-4 py-3">Price / night</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan={6}>
                    No properties found for this status.
                  </td>
                </tr>
              ) : (
                items.map((property) => (
                  <tr
                    key={property.id}
                    className="border-b border-slate-100 hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {property.title}
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-600">
                      {property.neighborhood || "No neighborhood"}
                    </td>
                    <td className="px-4 py-3">
                      {formatXAF(property.price_per_night || 0)}
                    </td>
                    <td className="px-4 py-3">
                      {property.max_guests ?? "No guest limit"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={property.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PropertyStatusAction
                        property={property}
                        busy={busyId === property.id}
                        onChangeStatus={changePropertyStatus}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
