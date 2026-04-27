import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="min-h-screen bg-[#F7F8F0] px-6 py-16 md:px-10 lg:px-16">
        <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm md:p-14">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-4xl">
              ✓
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">
              Reservation complete
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Booking Confirmed
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Your payment was successful and your reservation has been confirmed.
              We look forward to welcoming you for a smooth and comfortable stay.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/apartments"
                className="rounded-xl bg-sky-900 px-6 py-4 font-semibold text-white transition hover:bg-sky-800"
              >
                Book Another Stay
              </Link>

              <Link
                to="/"
                className="rounded-xl border border-slate-300 bg-white px-6 py-4 font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Back Home
              </Link>
            </div>

            <div className="mt-10 rounded-2xl bg-slate-50 p-5 text-left">
              <h2 className="text-lg font-semibold text-slate-900">
                What happens next?
              </h2>

              <div className="mt-4 space-y-3 text-slate-600">
                <p>• Your booking has been recorded successfully.</p>
                <p>• You can continue exploring other available apartments.</p>
                <p>• A real app would normally send a confirmation email or receipt here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}