import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import NotFound from "../components/NotFound";
import ApartmentSummary from "../components/ApartmentSummary";
import { useApartments } from "../hooks/useApartments";

export default function Payment() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getApartmentById } = useApartments();

  const bookingData = location.state;
  const apartment = getApartmentById(id);

  if (!apartment) {
    return <NotFound />;
  }

  if (!bookingData) {
    return (
      <NotFound
        tag="Missing data"
        title="No booking data found"
        description="Please go back and complete your booking first."
        backTo={`/booking/${apartment.id}`}
        backLabel="Back to booking"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <ApartmentSummary
            apartment={apartment}
            checkIn={bookingData.checkIn}
            checkOut={bookingData.checkOut}
            guests={bookingData.guests}
            nights={bookingData.nights}
            totalPrice={bookingData.totalPrice}
            tag="Booking summary"
            imageHeightClass="h-[300px]"
          />

          {/* RIGHT - PAYMENT FORM */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">
              Payment
            </p>

            <h1 className="mt-3 text-3xl font-semibold">
              Complete your payment
            </h1>

            <p className="mt-3 text-slate-600">
              Select your preferred payment method.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Payment Method
                </label>
                <select className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-sky-800">
                  <option>Mobile Money</option>
                  <option>Bank Card</option>
                  <option>Cash on Arrival</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Phone / Card Number
                </label>
                <input
                  type="text"
                  placeholder="Enter payment details"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-sky-800"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Name on Payment
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-sky-800"
                />
              </div>
            </div>

            <button
              onClick={() => navigate("/success")}
              className="mt-6 w-full rounded-xl bg-sky-900 px-5 py-4 font-semibold text-white hover:bg-sky-800"
            >
              Pay Now
            </button>

            <Link
              to="/apartments"
              className="mt-4 block text-center text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Back to apartments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
