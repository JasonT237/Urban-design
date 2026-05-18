import { useRef } from "react";
import PersonalInfoPanel from "../components/profile/PersonalInfoPanel";
import ProfileSummary from "../components/profile/ProfileSummary";
import {
  NotificationsPanel,
  SecuritySettingsPanel,
} from "../components/profile/SettingsPanel";
import { FeedbackBanner } from "../components/StatusMessage";
import { useProfile } from "../hooks/useProfile";

export default function Profile() {
  const profileFormRef = useRef(null);
  const {
    user,
    notifications,
    twoFactorSetup,
    isLoading,
    isSaving,
    isChangingPassword,
    isStartingTwoFactor,
    error,
    successMessage,
    saveProfile,
    changePassword,
    startTwoFactorSetup,
    confirmTwoFactorSetup,
  } = useProfile();

  const scrollToProfileForm = () => {
    profileFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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

        {isLoading ? (
          <div className="rounded-[2rem] border border-[#E7E8DE] bg-white p-8 text-slate-600 shadow-sm">
            Loading your profile...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <ProfileSummary user={user} onEditProfile={scrollToProfileForm} />

            <div className="space-y-6" ref={profileFormRef}>
              <FeedbackBanner error={error} successMessage={successMessage} />

              <PersonalInfoPanel
                isSaving={isSaving}
                key={user?.id}
                onSave={saveProfile}
                user={user}
              />
              <SecuritySettingsPanel
                isChangingPassword={isChangingPassword}
                isStartingTwoFactor={isStartingTwoFactor}
                onChangePassword={changePassword}
                onConfirmTwoFactor={confirmTwoFactorSetup}
                onStartTwoFactor={startTwoFactorSetup}
                twoFactorSetup={twoFactorSetup}
                user={user}
              />
              <NotificationsPanel notifications={notifications} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
