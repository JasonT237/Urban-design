import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContextValue";
import { loginUser, logoutUser, registerUser } from "../services/authApi";
import { getProfile } from "../services/usersApi";

const TOKEN_KEY = "access_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(Boolean(token));

  const persistSession = useCallback((authData) => {
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    setToken(authData.access_token);
    setUser(authData.user || null);
  }, []);

  const register = useCallback(
    async (body) => {
      const authData = await registerUser(body);
      persistSession(authData);
      return authData;
    },
    [persistSession],
  );

  const login = useCallback(
    async (body) => {
      const authData = await loginUser(body);
      persistSession(authData);
      return authData;
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setInitializing(false);
      return;
    }

    let active = true;

    async function loadProfile() {
      try {
        const profile = await getProfile();

        if (active) {
          setUser(profile);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);

        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setInitializing(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      initializing,
      isAuthenticated: Boolean(token),
      login,
      logout,
      register,
      token,
      user,
    }),
    [initializing, login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
