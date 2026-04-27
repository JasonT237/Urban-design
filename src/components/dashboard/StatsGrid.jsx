export default function StatsGrid({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

function StatCard({ label, value, caption }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">{value}</h2>
      <p className="mt-2 text-sm text-slate-600">{caption}</p>
    </div>
  );
}
