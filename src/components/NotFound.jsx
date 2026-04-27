import { Link } from "react-router-dom";

export default function NotFound({
  tag = "Not found",
  title = "Apartment not found",
  description = "The apartment you are looking for does not exist or is no longer available.",
  backTo = "/apartments",
  backLabel = "Back to apartments",
}) {
  return (
    <div className="min-h-screen bg-[#F7F8F0] px-4 py-12 md:px-8 lg:px-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
          {tag}
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-4 text-slate-600">{description}</p>
        <Link
          to={backTo}
          className="mt-8 inline-block rounded-full bg-sky-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
