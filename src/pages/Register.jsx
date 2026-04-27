import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function splitFullName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ");

  return {
    first_name: firstName,
    last_name: lastName,
  };
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const name = splitFullName(fullName);

    if (!name.first_name || !name.last_name) {
      setError("Please enter both first name and last name.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the terms before creating an account.");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        password,
        ...name,
      });

      navigate("/dashboard");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
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

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full rounded-2xl border border-[#E7E8DE] bg-[#F7F8F0] px-4 py-4 text-sm text-slate-800 outline-none transition focus:border-sky-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-2xl border border-[#E7E8DE] bg-[#F7F8F0] px-4 py-4 text-sm text-slate-800 outline-none transition focus:border-sky-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+237670000000"
                    className="w-full rounded-2xl border border-[#E7E8DE] bg-[#F7F8F0] px-4 py-4 text-sm text-slate-800 outline-none transition focus:border-sky-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    required
                    minLength={8}
                    className="w-full rounded-2xl border border-[#E7E8DE] bg-[#F7F8F0] px-4 py-4 text-sm text-slate-800 outline-none transition focus:border-sky-200"
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-slate-500">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    className="mt-1 rounded"
                  />
                  <span>
                    I agree to the{" "}
                    <span className="font-medium text-sky-900">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="font-medium text-sky-900">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </label>

                {error && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-sky-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Creating account..." : "Create Account"}
                </button>
              </form>

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
