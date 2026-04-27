import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NotFound from "../components/NotFound";
import ApartmentSummary from "../components/ApartmentSummary";
import { useApartments } from "../hooks/useApartments";
import { calculateNights, formatXAF } from "../lib/format";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getApartmentById } = useApartments();
  const bookingState = location.state || {};

  const [checkIn, setCheckIn] = useState(() => bookingState.checkIn || "");
  const [checkOut, setCheckOut] = useState(() => bookingState.checkOut || "");
  const [guests, setGuests] = useState(() => bookingState.guests || 1);

  const apartment = getApartmentById(id);

  if (!apartment) {
    return <NotFound />;
  }

  const nights = calculateNights(checkIn, checkOut);
  const totalPrice = nights * apartment.price;

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <ApartmentSummary
            apartment={apartment}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            nights={nights}
            totalPrice={totalPrice}
            tag="Your stay"
            imageHeightClass="h-[320px]"
          />

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">
              Complete your booking
            </p>

            <h1 className="mt-3 text-3xl font-semibold">Book your stay</h1>

            <p className="mt-3 text-slate-600">
              Select your dates and confirm your reservation.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-800"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-800"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Guests
                </label>
                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-800"
                />
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#F7F8F0] p-5">
              <div className="flex justify-between text-slate-600">
                <span>Nights</span>
                <span>{nights}</span>
              </div>

              <div className="mt-2 flex justify-between text-slate-600">
                <span>Price per night</span>
                <span>{formatXAF(apartment.price)}</span>
              </div>

              <div className="mt-4 flex justify-between border-t pt-4 text-lg font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatXAF(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={() =>
                navigate(`/payment/${apartment.id}`, {
                  state: {
                    checkIn,
                    checkOut,
                    guests,
                    nights,
                    totalPrice,
                  },
                })
              }
              className="mt-6 w-full rounded-xl bg-sky-900 px-5 py-4 font-semibold text-white transition hover:bg-sky-800"
            >
              Confirm Booking
            </button>

            <p className="mt-4 text-center text-sm text-slate-500">
              You will review payment on the next step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
