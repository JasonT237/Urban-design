const statusClasses = {
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  upcoming: "bg-sky-100 text-sky-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }) {
  const label = status || "Pending";
  const key = typeof label === "string" ? label.toLowerCase() : "";
  const tone = statusClasses[key] || "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${tone}`}
    >
      {label}
    </span>
  );
}
