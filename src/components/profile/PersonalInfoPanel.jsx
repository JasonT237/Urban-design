import { useState } from "react";

export default function PersonalInfoPanel({ user, isSaving, onSave }) {
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const body = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    };

    if (avatarUrl.trim()) {
      body.avatar_url = avatarUrl.trim();
    }

    await onSave(body);
  };

  return (
    <ProfilePanel title="Personal Information">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            label="First Name"
            onChange={setFirstName}
            required
            type="text"
            value={firstName}
          />
          <TextField
            label="Last Name"
            onChange={setLastName}
            required
            type="text"
            value={lastName}
          />
          <TextField
            label="Email Address"
            readOnly
            type="email"
            value={user?.email || ""}
          />
          <TextField
            label="Phone Number"
            readOnly
            type="text"
            value={user?.phone || ""}
          />
          <div className="md:col-span-2">
            <TextField
              label="Avatar URL"
              onChange={setAvatarUrl}
              type="url"
              value={avatarUrl}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            className="rounded-2xl bg-sky-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
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

function TextField({ label, onChange, readOnly = false, type, value, required }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        className={`w-full rounded-2xl border border-transparent bg-[#E6E5DB] px-4 py-4 text-base text-slate-800 outline-none transition focus:border-sky-200 ${
          readOnly ? "cursor-not-allowed text-slate-500" : ""
        }`}
        onChange={(event) => onChange?.(event.target.value)}
        readOnly={readOnly}
        required={required}
        type={type}
        value={value}
      />
    </div>
  );
}

export function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      {children}
    </label>
  );
}
