import PersonalInfoPanel from "../components/profile/PersonalInfoPanel";
import ProfileSummary from "../components/profile/ProfileSummary";
import SettingsPanel from "../components/profile/SettingsPanel";
import {
  languageOptions,
  notificationSettings,
  profileFields,
  securitySettings,
} from "../data/profileContent";

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#F7F8F0] px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-sky-900 md:text-5xl">
            User Profile Management
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
            Manage your account settings, security, and communication preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <ProfileSummary />

          <div className="space-y-6">
            <PersonalInfoPanel
              fields={profileFields}
              languageOptions={languageOptions}
            />
            <SettingsPanel title="Security Settings" settings={securitySettings} />
            <SettingsPanel
              title="Notification Settings"
              settings={notificationSettings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
