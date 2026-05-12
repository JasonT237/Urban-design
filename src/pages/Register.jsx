import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthTextField from "../components/auth/AuthTextField";
import PasswordField from "../components/auth/PasswordField";
import { registerUser } from "../services/authApi";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleRegister = async () => {
    setRegisterError("");

    try {
      const registerBody = {
        email,
        phone,
        password,
        first_name,
        last_name,
      };

      await registerUser(registerBody);
      navigate("/login");
    } catch (error) {
      console.error(error);
      setRegisterError(error.message || "Could not create your account.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden lg:flex">
          <div className="h-full w-full bg-[#D7AF79]" />
          <div className="absolute bottom-0 left-0 right-0 h-52 bg-sky-950/95" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-[linear-gradient(to_top,rgba(12,44,69,1),rgba(12,44,69,0.8),transparent)]" />

          <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
            <p className="text-lg font-semibold tracking-tight">
              Urban Sanctuary
            </p>

            <div className="max-w-md pb-8">
              <h1 className="text-5xl font-semibold leading-tight">
                Your gateway to serenity in Douala.
              </h1>
              <p className="mt-5 text-sm leading-7 text-white/85">
                Experience the comfort of high-end urban living. Join our
                community of discerning travelers and professionals.
              </p>

              <div className="mt-10 flex gap-6 text-[11px] uppercase tracking-[0.22em] text-white/70">
                <span>Bonapriso</span>
                <span>Akwa</span>
                <span>Kotto</span>
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
                Create Account
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your details to start your journey with us.
              </p>

              <form className="mt-8 space-y-5">
                <AuthTextField
                  label="First Name"
                  placeholder="John"
                  value={first_name}
                  onChange={setFirstName}
                />
                <AuthTextField
                  label="Last Name"
                  placeholder="Doe"
                  value={last_name}
                  onChange={setLastName}
                />
                <AuthTextField
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={setEmail}
                />
                <AuthTextField
                  label="Phone Number"
                  placeholder="+237670000000"
                  value={phone}
                  onChange={setPhone}
                />

                <div>
                  <PasswordField
                    id="register-password"
                    placeholder="Create a password"
                    value={password}
                    onChange={setPassword}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRegister}
                  className="w-full rounded-2xl bg-sky-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-800"
                >
                  Create Account
                </button>
              </form>

              {registerError && (
                <p className="mt-4 text-center text-sm text-red-600">
                  {registerError}
                </p>
              )}
              <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-sky-800 hover:text-sky-900"
                >
                  Sign in
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
