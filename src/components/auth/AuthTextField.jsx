export default function AuthTextField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-[#E7E8DE] bg-[#F7F8F0] px-4 py-4 text-sm text-slate-800 outline-none transition focus:border-sky-200"
      />
    </div>
  );
}
