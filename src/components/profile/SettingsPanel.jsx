import { ProfilePanel } from "./PersonalInfoPanel";

export default function SettingsPanel({ title, settings }) {
  return (
    <ProfilePanel title={title}>
      <div className="space-y-5">
        {settings.map((setting) => (
          <SettingRow key={setting.title} setting={setting} />
        ))}
      </div>
    </ProfilePanel>
  );
}

function SettingRow({ setting }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xl font-semibold text-sky-900">{setting.title}</p>
        <p className="mt-1 text-sm text-slate-500">{setting.description}</p>
      </div>

      {setting.action ? (
        <button className="rounded-2xl bg-[#E9E7DD] px-6 py-3 text-sm font-semibold text-sky-900 transition hover:bg-[#dfddd3]">
          {setting.action}
        </button>
      ) : (
        <Toggle enabled={setting.enabled} />
      )}
    </div>
  );
}

function Toggle({ enabled }) {
  return (
    <button
      className={`flex h-10 w-20 items-center rounded-full px-1 ${
        enabled ? "bg-sky-900" : "bg-[#D9D7CB]"
      }`}
      type="button"
    >
      <span
        className={`flex h-8 w-8 rounded-full bg-white shadow-sm ${
          enabled ? "ml-auto" : ""
        }`}
      />
    </button>
  );
}
