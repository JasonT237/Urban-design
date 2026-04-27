import { Link } from "react-router-dom";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Welcome back, Marc.
        </h1>
        <p className="mt-2 text-slate-600">
          Here's what's happening with your stays in Douala.
        </p>
      </div>

      <Link
        to="/apartments"
        className="inline-flex rounded-xl bg-sky-900 px-5 py-3 font-semibold text-white transition hover:bg-sky-800"
      >
        + New Booking
      </Link>
    </div>
  );
}
