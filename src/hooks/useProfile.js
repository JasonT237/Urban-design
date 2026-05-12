import { useCallback, useEffect, useState } from "react";
import { confirmTwoFactor, enableTwoFactor } from "../services/authApi";
import {
  changeCurrentUserPassword,
  getCurrentUser,
  getCurrentUserNotifications,
  updateCurrentUser,
} from "../services/usersApi";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function useProfile() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [twoFactorSetup, setTwoFactorSetup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isStartingTwoFactor, setIsStartingTwoFactor] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [userData, notificationData] = await Promise.all([
        getCurrentUser(),
        getCurrentUserNotifications({ page: 1, per_page: 5 }).catch(() => []),
      ]);

      setUser(userData);
      setNotifications(asArray(notificationData));
    } catch (loadError) {
      setError(loadError.message || "Could not load your profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const saveProfile = async (body) => {
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const updatedUser = await updateCurrentUser(body);
      setUser(updatedUser);
      setSuccessMessage("Profile updated.");
    } catch (saveError) {
      setError(saveError.message || "Could not update your profile.");
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async (body) => {
    setIsChangingPassword(true);
    setError("");
    setSuccessMessage("");

    try {
      await changeCurrentUserPassword(body);
      setSuccessMessage("Password updated.");
    } catch (passwordError) {
      setError(passwordError.message || "Could not update your password.");
      throw passwordError;
    } finally {
      setIsChangingPassword(false);
    }
  };

  const startTwoFactorSetup = async () => {
    setIsStartingTwoFactor(true);
    setError("");
    setSuccessMessage("");

    try {
      const setupData = await enableTwoFactor();
      setTwoFactorSetup(setupData);
      setSuccessMessage("Two-factor setup started.");
    } catch (twoFactorError) {
      setError(twoFactorError.message || "Could not start two-factor setup.");
      throw twoFactorError;
    } finally {
      setIsStartingTwoFactor(false);
    }
  };

  const confirmTwoFactorSetup = async (code) => {
    setError("");
    setSuccessMessage("");

    try {
      await confirmTwoFactor({ code });
      setTwoFactorSetup(null);
      setSuccessMessage("Two-factor authentication enabled.");
      await loadProfile();
    } catch (twoFactorError) {
      setError(twoFactorError.message || "Could not confirm two-factor setup.");
      throw twoFactorError;
    }
  };

  return {
    user,
    notifications,
    twoFactorSetup,
    isLoading,
    isSaving,
    isChangingPassword,
    isStartingTwoFactor,
    error,
    successMessage,
    reloadProfile: loadProfile,
    saveProfile,
    changePassword,
    startTwoFactorSetup,
    confirmTwoFactorSetup,
  };
}
