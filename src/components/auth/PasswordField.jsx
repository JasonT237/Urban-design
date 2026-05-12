import { useState } from "react";

export default function PasswordField({
  id,
  label = "Password",
  placeholder,
  value,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-[#E7E8DE] bg-[#F7F8F0] px-4 py-4 pr-20 text-sm text-slate-800 outline-none transition focus:border-sky-200"
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-sky-800 hover:text-sky-900"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
