export default function FilterChipGroup({
  label,
  options,
  selectedOption,
  onSelect,
  getOptionLabel = (option) => option,
}) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const active = selectedOption === option;

          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-sky-900 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
              type="button"
            >
              {getOptionLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
