import { NavLink, Outlet } from "react-router-dom";
import { useAdminPortal } from "../../hooks/useAdminPortal";

const nav = [
  { to: "/admin", end: true, label: "Dashboard", icon: "grid" },
  { to: "/admin/users", label: "User Management", icon: "users" },
  { to: "/admin/properties", label: "Property Listings", icon: "building" },
  { to: "/admin/content", label: "Content Editor", icon: "edit" },
  { to: "/admin/security", label: "Security Settings", icon: "shield" },
  { to: "/admin/support", label: "Support Tickets", icon: "help" },
];

function AdminIcon({ name }) {
  const common = {
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (name === "users") {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
        <path d="M16 3.1a4 4 0 0 1 0 7.8" />
      </svg>
    );
  }

  if (name === "building") {
    return (
      <svg {...common}>
        <path d="M4 21V5a2 2 0 0 1 2-2h8v18" />
        <path d="M14 8h4a2 2 0 0 1 2 2v11" />
        <path d="M8 7h2M8 11h2M8 15h2M17 12h.01M17 16h.01" />
      </svg>
    );
  }

  if (name === "edit") {
    return (
      <svg {...common}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  if (name === "help") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.1 9a3 3 0 1 1 5.8 1c-.4 1.1-1.5 1.7-2.1 2.3-.5.5-.8 1-.8 1.7" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </svg>
  );
}

export default function AdminLayout() {
  const { sidebarCollapsed, toggleSidebar, exportAuditLogs } = useAdminPortal();

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-slate-950 lg:flex">
      <aside
        className={`sticky top-0 z-20 flex h-screen shrink-0 flex-col border-r border-[#E4E6DA] bg-[#F7F8F0] transition-all duration-200 max-lg:hidden ${
          sidebarCollapsed ? "w-24" : "w-[300px]"
        }`}
      >
        <div className="px-8 pb-10 pt-7">
          <button type="button" onClick={toggleSidebar} className="sr-only">
            Toggle sidebar
          </button>
          {!sidebarCollapsed && (
            <>
              <p className="text-2xl font-bold leading-none tracking-tight text-sky-950">
                Admin Console
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-sky-800">
                Management Portal
              </p>
            </>
          )}
        </div>

        <nav className="flex-1 space-y-3 px-5">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-lg px-4 py-3 text-lg font-medium transition ${
                  isActive
                    ? "bg-[#E0E2D8] text-sky-950"
                    : "text-sky-900 hover:bg-[#E9EBE1]"
                }`
              }
            >
              <AdminIcon name={item.icon} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#E4E6DA] p-5">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0C48C] text-lg font-bold text-white">
              A
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-slate-950">
                  Admin User
                </p>
                <p className="truncate text-sm text-sky-800">Super Admin</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => exportAuditLogs()}
            className="w-full rounded-md bg-sky-950 px-4 py-3 text-base font-bold text-white shadow-sm transition hover:bg-sky-900"
          >
            {!sidebarCollapsed ? "Export Reports" : "Export"}
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto">
        <div className="border-b border-[#E4E6DA] bg-[#F7F8F0] px-5 py-4 lg:hidden">
          <p className="text-xl font-bold text-sky-950">Admin Console</p>
          <p className="text-xs uppercase tracking-[0.16em] text-sky-800">
            Management Portal
          </p>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
