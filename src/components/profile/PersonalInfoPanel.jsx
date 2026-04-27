export default function PersonalInfoPanel({ fields, languageOptions }) {
  return (
    <ProfilePanel title="Personal Information">
      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <TextField key={field.label} {...field} />
        ))}

        <div>
          <FieldLabel>Preferred Language</FieldLabel>
          <select className="w-full rounded-2xl border border-transparent bg-[#E6E5DB] px-4 py-4 text-base text-slate-800 outline-none transition focus:border-sky-200">
            {languageOptions.map((language) => (
              <option key={language}>{language}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="rounded-2xl bg-sky-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-sky-800">
          Save Changes
        </button>
      </div>
    </ProfilePanel>
  );
}

export function ProfilePanel({ title, children }) {
  return (
    <div className="rounded-[2rem] border border-[#E7E8DE] bg-[#F3F2EA] p-6 shadow-sm md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-3xl font-semibold text-sky-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function TextField({ label, type, defaultValue }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-transparent bg-[#E6E5DB] px-4 py-4 text-base text-slate-800 outline-none transition focus:border-sky-200"
      />
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      {children}
    </label>
  );
}
