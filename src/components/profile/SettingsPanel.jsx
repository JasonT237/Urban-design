import { ProfilePanel } from "./PersonalInfoPanel";
import { FieldLabel } from "./PersonalInfoPanel";
import { useState } from "react";

export function SecuritySettingsPanel({
  isChangingPassword,
  isStartingTwoFactor,
  onChangePassword,
  onConfirmTwoFactor,
  onStartTwoFactor,
  twoFactorSetup,
  user,
}) {
  return (
    <ProfilePanel title="Security Settings">
      <div className="space-y-5">
        <PasswordForm
          isChangingPassword={isChangingPassword}
          onChangePassword={onChangePassword}
          requiresTotp={Boolean(user?.totp_enabled)}
        />
        <TwoFactorPanel
          isStartingTwoFactor={isStartingTwoFactor}
          onConfirmTwoFactor={onConfirmTwoFactor}
          onStartTwoFactor={onStartTwoFactor}
          setup={twoFactorSetup}
          user={user}
        />
      </div>
    </ProfilePanel>
  );
}

export function NotificationsPanel({ notifications }) {
  return (
    <ProfilePanel title="Notifications">
      {notifications.length ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationRow key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
          No notifications yet.
        </div>
      )}
    </ProfilePanel>
  );
}

function PasswordForm({ isChangingPassword, onChangePassword, requiresTotp }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const body = {
      current_password: currentPassword,
      new_password: newPassword,
    };

    if (totpCode) {
      body.totp_code = totpCode;
    }

    await onChangePassword(body);
    setCurrentPassword("");
    setNewPassword("");
    setTotpCode("");
  };

  return (
    <form
      className="rounded-2xl bg-white p-5"
      onSubmit={handleSubmit}
    >
      <div>
        <p className="text-xl font-semibold text-sky-900">Password</p>
        <p className="mt-1 text-sm text-slate-500">
          Update the password used when you log in.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel>Current Password</FieldLabel>
          <input
            className="w-full rounded-2xl border border-transparent bg-[#F7F8F0] px-4 py-4 text-base text-slate-800 outline-none transition focus:border-sky-200"
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
            type="password"
            value={currentPassword}
          />
        </div>
        <div>
          <FieldLabel>New Password</FieldLabel>
          <input
            className="w-full rounded-2xl border border-transparent bg-[#F7F8F0] px-4 py-4 text-base text-slate-800 outline-none transition focus:border-sky-200"
            minLength={8}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            type="password"
            value={newPassword}
          />
        </div>
        {requiresTotp && (
          <div className="md:col-span-2">
            <FieldLabel>Two-Factor Code</FieldLabel>
            <input
              className="w-full rounded-2xl border border-transparent bg-[#F7F8F0] px-4 py-4 text-base text-slate-800 outline-none transition focus:border-sky-200"
              maxLength={6}
              minLength={6}
              onChange={(event) => setTotpCode(event.target.value)}
              required
              type="text"
              value={totpCode}
            />
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          className="rounded-2xl bg-[#E9E7DD] px-6 py-3 text-sm font-semibold text-sky-900 transition hover:bg-[#dfddd3] disabled:cursor-not-allowed disabled:text-slate-400"
          disabled={isChangingPassword}
          type="submit"
        >
          {isChangingPassword ? "Updating..." : "Change Password"}
        </button>
      </div>
    </form>
  );
}

function TwoFactorPanel({
  isStartingTwoFactor,
  onConfirmTwoFactor,
  onStartTwoFactor,
  setup,
  user,
}) {
  const [code, setCode] = useState("");

  const handleConfirm = async (event) => {
    event.preventDefault();
    await onConfirmTwoFactor(code);
    setCode("");
  };

  return (
    <div className="rounded-2xl bg-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xl font-semibold text-sky-900">
            Two-Factor Authentication
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {user?.totp_enabled
              ? "Your account requires a verification code."
              : "Add a verification code to protect your account."}
          </p>
        </div>

        {user?.totp_enabled ? (
          <Toggle enabled />
        ) : (
          <button
            className="rounded-2xl bg-[#E9E7DD] px-6 py-3 text-sm font-semibold text-sky-900 transition hover:bg-[#dfddd3] disabled:cursor-not-allowed disabled:text-slate-400"
            disabled={isStartingTwoFactor}
            onClick={onStartTwoFactor}
            type="button"
          >
            {isStartingTwoFactor ? "Starting..." : "Start Setup"}
          </button>
        )}
      </div>

      {setup && (
        <form className="mt-5 rounded-2xl bg-[#F7F8F0] p-4" onSubmit={handleConfirm}>
          <div className="grid gap-4">
            {setup.secret && (
              <div>
                <FieldLabel>Secret</FieldLabel>
                <input
                  className="w-full rounded-2xl border border-transparent bg-white px-4 py-4 text-base text-slate-800 outline-none"
                  readOnly
                  type="text"
                  value={setup.secret}
                />
              </div>
            )}
            {setup.qr_code_url && (
              <div>
                <FieldLabel>Authenticator URL</FieldLabel>
                <input
                  className="w-full rounded-2xl border border-transparent bg-white px-4 py-4 text-base text-slate-800 outline-none"
                  readOnly
                  type="text"
                  value={setup.qr_code_url}
                />
              </div>
            )}
            <div>
              <FieldLabel>Confirmation Code</FieldLabel>
              <input
                className="w-full rounded-2xl border border-transparent bg-white px-4 py-4 text-base text-slate-800 outline-none transition focus:border-sky-200"
                maxLength={6}
                minLength={6}
                onChange={(event) => setCode(event.target.value)}
                required
                type="text"
                value={code}
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button
              className="rounded-2xl bg-sky-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
              type="submit"
            >
              Confirm 2FA
            </button>
          </div>
        </form>
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

function NotificationRow({ notification }) {
  const date = notification.created_at
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(notification.created_at))
    : "No date";

  return (
    <div className="rounded-2xl bg-white p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-semibold text-sky-900">
            {notification.title || notification.type || "Notification"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {notification.content || "No notification content."}
          </p>
        </div>
        <div className="shrink-0 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 md:text-right">
          <p>{notification.channel || "app"}</p>
          <p className="mt-2 normal-case tracking-normal">{date}</p>
        </div>
      </div>
    </div>
  );
}
