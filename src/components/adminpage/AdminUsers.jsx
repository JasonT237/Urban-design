import { useAdminUsers } from "../../hooks/useAdminUsers";

const ROLES = ["guest", "homeowner", "admin"];

function formatRole(role) {
  if (role === "homeowner") return "HOMEOWNER";
  if (role === "admin") return "SUPER ADMIN";
  return "TRAVELER";
}

function getInitials(user) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const source = name || user.email || "Admin User";
  return source
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getName(user) {
  return (
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.email ||
    "Unknown User"
  );
}

function formatJoinDate(date) {
  if (!date) return "Joined recently";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Joined recently";

  return `Joined ${parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })}`;
}

function StatusDot({ active }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          active === false ? "bg-slate-500" : "bg-sky-900"
        }`}
      />
      {active === false ? "Inactive" : "Active"}
    </span>
  );
}

function ActionIcon({ type }) {
  const common = {
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (type === "block") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m6.7 6.7 10.6 10.6" />
      </svg>
    );
  }

  if (type === "check") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.4 2.4 4.8-5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function StatCard({ label, value, helper, active }) {
  return (
    <div
      className={`rounded-xl bg-[#F1F2EA] p-8 ${
        active ? "border-l-4 border-sky-950" : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-800">
        {label}
      </p>
      <div className="mt-5 flex items-end justify-between gap-4">
        <p className="text-4xl font-bold tracking-tight text-sky-950">
          {value}
        </p>
        {helper && <p className="text-sm text-sky-800">{helper}</p>}
      </div>
    </div>
  );
}

function UserRow({ user, busy, onRoleChange, onToggleActive }) {
  const active = user.is_active !== false;

  return (
    <tr className="border-b border-[#EFF0E8] bg-white last:border-b-0">
      <td className="px-8 py-7">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-200 text-base font-semibold text-sky-950">
            {getInitials(user)}
          </div>
          <div>
            <p className="text-base font-bold text-sky-950">{getName(user)}</p>
            <p className="text-sm text-sky-700">
              {formatJoinDate(user.created_at)}
            </p>
          </div>
        </div>
      </td>
      <td className="px-8 py-7 text-base text-slate-800">
        {user.email || user.phone || "No contact"}
      </td>
      <td className="px-8 py-7">
        <select
          value={user.role || "guest"}
          disabled={busy}
          onChange={(event) => onRoleChange(user.id, event.target.value)}
          className="rounded-full border-0 bg-[#E5E5DE] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-900 outline-none transition focus:ring-2 focus:ring-sky-900"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {formatRole(role)}
            </option>
          ))}
        </select>
      </td>
      <td className="px-8 py-7">
        <StatusDot active={active} />
      </td>
      <td className="px-8 py-7">
        <div className="flex items-center gap-6 text-sky-950">
          <button
            type="button"
            disabled={busy}
            onClick={() => onRoleChange(user.id, user.role || "guest")}
            className="transition hover:text-sky-700 disabled:opacity-40"
            aria-label="Update user role"
          >
            <ActionIcon type="edit" />
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onToggleActive(user.id, !active)}
            className={`transition disabled:opacity-40 ${
              active ? "text-red-700 hover:text-red-800" : "text-sky-900"
            }`}
            aria-label={active ? "Deactivate user" : "Activate user"}
          >
            <ActionIcon type={active ? "block" : "check"} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminUsers() {
  const {
    users,
    meta,
    loading,
    error,
    busyId,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    activeUsers,
    pendingUsers,
    applyFilters,
    changeUserRole,
    toggleUserStatus,
  } = useAdminUsers();

  return (
    <div className="min-h-screen px-5 py-8 md:px-10 lg:px-14">
      <header className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-sky-950">
            Admin: User Management
          </h1>
          <p className="mt-3 text-xl text-sky-900">
            Review, manage and moderate platform participants.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex min-w-0 items-center gap-3 rounded-full bg-[#E3E4DC] px-5 py-3">
            <svg
              className="h-5 w-5 shrink-0 text-slate-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users..."
              className="w-full bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-lg border-0 bg-[#E0E1D9] px-5 py-3 text-base font-semibold text-sky-950 outline-none focus:ring-2 focus:ring-sky-900"
          >
            <option value="">Filter</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {formatRole(role)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={applyFilters}
            className="rounded-lg bg-sky-950 px-6 py-3 text-base font-bold text-white transition hover:bg-sky-900"
          >
            Apply
          </button>
        </div>
      </header>

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="mt-12 grid gap-7 lg:grid-cols-3">
        <StatCard label="Total users" value={meta.total ?? users.length} />
        <StatCard
          label="Active sessions"
          value={activeUsers}
          helper="Currently Online"
          active
        />
        <StatCard
          label="Pending verification"
          value={pendingUsers}
          helper="Review All"
        />
      </section>

      <section className="mt-12 overflow-hidden rounded-xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        {loading ? (
          <p className="p-8 text-slate-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-left">
              <thead>
                <tr className="bg-[#F1F2EA] text-xs font-bold uppercase tracking-[0.22em] text-sky-900">
                  <th className="px-8 py-5">User name</th>
                  <th className="px-8 py-5">Email address</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    busy={busyId === user.id}
                    onRoleChange={changeUserRole}
                    onToggleActive={toggleUserStatus}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-4 border-t border-[#EFF0E8] px-8 py-5 text-sky-900 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing <strong>{users.length}</strong> of{" "}
            <strong>{meta.total ?? users.length}</strong> users
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-md bg-[#F0F1EA] px-5 py-3 font-bold text-slate-400"
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-md bg-[#E0E1D9] px-5 py-3 font-bold text-sky-950"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <footer className="mt-24 flex flex-col gap-3 border-t border-[#E4E6DA] py-5 text-sm text-sky-900 lg:flex-row lg:items-center lg:justify-between">
        <p>(c) 2024 Urban Sanctuary Douala. All rights reserved.</p>
        <div className="flex gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </footer>
    </div>
  );
}
