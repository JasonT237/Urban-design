export default function DetailsSection({ eyebrow, title, children }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
        {eyebrow}
      </p>

      {title && (
        <h2 className="mt-4 text-3xl font-semibold text-slate-900">{title}</h2>
      )}

      {children}
    </div>
  );
}
