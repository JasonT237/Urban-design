import { Link } from "react-router-dom";

const portalLinks = [
  { id: "dashboard", label: "My Bookings", to: "/dashboard" },
  { id: "history", label: "Transaction History", to: "/history" },
  { id: "saved", label: "Saved Places", to: "/saved" },
];

const defaultMemberStatus = {
  message: "Your booking activity will update your member status.",
  progress: 0,
};

function PortalSidebar({ active, memberStatus = defaultMemberStatus }) {
  return (
    <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Menu
      </p>

      <div className="space-y-3">
        {portalLinks.map((link) => (
          <Link
            key={link.id}
            to={link.to}
            className={`flex w-full items-center rounded-2xl px-4 py-3 text-sm transition ${
              active === link.id
                ? "bg-sky-900 font-semibold text-white shadow-sm hover:bg-sky-800"
                : "font-medium text-slate-700 hover:bg-slate-100 hover:text-sky-900"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-[1.5rem] bg-[#F7F8F0] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Member status
        </p>
        <p className="mt-2 text-sm text-slate-700">{memberStatus.message}</p>
        <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-sky-900"
            style={{ width: `${memberStatus.progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}

export default function PortalLayout({ active, children, memberStatus }) {
  return (
    <div className="min-h-screen bg-[#F7F8F0] px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <PortalSidebar active={active} memberStatus={memberStatus} />
          <section>{children}</section>
        </div>
      </div>
    </div>
  );
}
