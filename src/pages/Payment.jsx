import { useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import NotFound from "../components/NotFound";
import ApartmentSummary from "../components/ApartmentSummary";
import LoadingScreen from "../components/LoadingScreen";
import { useApartmentResource } from "../hooks/useApartmentResource";
import { useAuthToken } from "../hooks/useAuthToken";
import { initiatePayment as initiatePaymentRequest } from "../services/paymentsApi";

export default function Payment() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { apartment, isLoading: isLoadingApartment } = useApartmentResource(id);
  const { isAuthenticated } = useAuthToken();
  const bookingData = location.state;
  const [phoneNumber, setPhoneNumber] = useState("+237670000000");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  if (isLoadingApartment) {
    return <LoadingScreen message="Loading apartment..." />;
  }

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

  const initiatePayment = async () => {
    setPaymentError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!bookingData.bookingId) {
      setPaymentError("No booking id found for this payment.");
      return;
    }

    try {
      setIsPaying(true);

      const paymentBody = {
        booking_id: bookingData.bookingId,
        provider: "mtn_momo",
        phone_number: phoneNumber,
      };

      await initiatePaymentRequest(paymentBody);
      navigate("/success");
    } catch (error) {
      console.error(error);
      setPaymentError(error.message || "Could not start payment.");
    } finally {
      setIsPaying(false);
    }
  };

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
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
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
              onClick={initiatePayment}
              disabled={isPaying}
              className="mt-6 w-full rounded-xl bg-sky-900 px-5 py-4 font-semibold text-white hover:bg-sky-800"
            >
              {isPaying ? "Starting payment..." : "Pay Now"}
            </button>

            {paymentError && (
              <p className="mt-4 text-center text-sm text-red-600">
                {paymentError}
              </p>
            )}

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
