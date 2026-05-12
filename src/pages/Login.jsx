import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthTextField from "../components/auth/AuthTextField";
import PasswordField from "../components/auth/PasswordField";
import { useAuthToken } from "../hooks/useAuthToken";
import { loginUser } from "../services/authApi";

export default function Login() {
  const navigate = useNavigate();
  const { saveToken } = useAuthToken();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const getAccessToken = (payload) => {
    return (
      payload?.data?.access_token ||
      payload?.data?.accessToken ||
      payload?.data?.token ||
      payload?.access_token ||
      payload?.accessToken ||
      payload?.token
    );
  };

  const handleLogin = async () => {
    setLoginError("");

    try {
      const loginBody = {
        email,
        password,
      };

      const data = await loginUser(loginBody);
      const token = getAccessToken(data);

      if (!token) {
        setLoginError("Login worked, but no access token was returned.");
        return;
      }

      saveToken(token);
      navigate("/discover");
    } catch (error) {
      console.error(error);
      setLoginError(error.message || "Could not log in.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden lg:flex">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
            alt="Luxury apartment"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-slate-900/40" />

          <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
            <p className="text-lg font-semibold tracking-tight">
              Urban Sanctuary
            </p>

            <div className="max-w-md">
              <h1 className="text-5xl font-semibold leading-tight">
                Find your peace in the heart of Douala.
              </h1>
              <p className="mt-5 text-sm leading-7 text-white/85">
                Curated living spaces designed for the modern professional.
                Experience the sanctuary you deserve.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/70">
              <span>2026 Urban Sanctuary Douala</span>
              <div className="flex gap-4">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Help Center</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 md:px-10">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <p className="text-xl font-semibold tracking-tight text-sky-900">
                Urban Sanctuary
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#E7E8DE] bg-white p-8 shadow-sm">
              <h2 className="text-4xl font-semibold tracking-tight text-sky-900">
                Welcome back
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Please enter your details to access your sanctuary.
              </p>

              <form className="mt-8 space-y-5">
                <AuthTextField
                  label="Email or Phone Number"
                  placeholder="e.g. name@company.com"
                  value={email}
                  onChange={setEmail}
                />

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-medium text-sky-800 hover:text-sky-900"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <PasswordField
                    id="login-password"
                    label=""
                    placeholder="Enter your password"
                    value={password}
                    onChange={setPassword}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full rounded-2xl bg-sky-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-800"
                >
                  Log In
                </button>
              </form>

              {loginError && (
                <p className="mt-4 text-center text-sm text-red-600">
                  {loginError}
                </p>
              )}

              <p className="mt-8 text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-sky-800 hover:text-sky-900"
                >
                  Create an account
                </Link>
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Help Center</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
