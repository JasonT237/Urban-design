import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import NotFound from "../components/NotFound";
import LoadingScreen from "../components/LoadingScreen";
import { useApartmentResource } from "../hooks/useApartmentResource";
import { useAuthToken } from "../hooks/useAuthToken";
import { formatShortDate } from "../lib/format";
import { initiatePayment as initiatePaymentRequest } from "../services/paymentsApi";

const paymentMethods = [
  { id: "mobile_money", label: "Mobile Money", icon: "phone" },
  { id: "card", label: "Card", icon: "card" },
  { id: "bank", label: "Bank", icon: "bank" },
];

const mobileMoneyProviders = [
  {
    id: "mtn_momo",
    label: "MTN MoMo",
    description: "Instant processing",
  },
  {
    id: "orange_money",
    label: "Orange Money",
    description: "Standard checkout",
  },
];

function formatCFA(amount) {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "0 CFA";
  return `${amount.toLocaleString()} CFA`;
}

function PaymentIcon({ type }) {
  const common = {
    className: "h-4 w-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (type === "card") {
    return (
      <svg {...common}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
      </svg>
    );
  }

  if (type === "bank") {
    return (
      <svg {...common}>
        <path d="M4 10h16" />
        <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
        <path d="M3 18h18M12 4l8 4H4Z" />
      </svg>
    );
  }

  if (type === "lock") {
    return (
      <svg {...common}>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  if (type === "info") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}

function CheckoutStepper() {
  const steps = [
    { number: 1, label: "Details", done: true },
    { number: 2, label: "Payment", active: true },
    { number: 3, label: "Confirm" },
  ];

  return (
    <div className="mx-auto flex max-w-xl items-center justify-center gap-4 px-4 py-10">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                step.active || step.done
                  ? "bg-sky-900 text-white"
                  : "bg-[#DDDED7] text-slate-500"
              }`}
            >
              {step.number}
            </span>
            <span
              className={`text-sm md:text-base ${
                step.active
                  ? "font-bold text-sky-950"
                  : step.done
                    ? "text-sky-900"
                    : "text-slate-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <span
              className={`hidden h-px w-14 md:block ${
                step.done ? "bg-sky-300" : "bg-[#DDDED7]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function MethodTabs({ selectedMethod, onSelectMethod }) {
  return (
    <div className="grid gap-2 rounded-xl bg-[#F0F1EA] p-2 md:grid-cols-3">
      {paymentMethods.map((method) => (
        <button
          key={method.id}
          type="button"
          onClick={() => onSelectMethod(method.id)}
          className={`flex items-center justify-center gap-3 rounded-lg px-5 py-4 text-sm font-bold uppercase tracking-[0.08em] transition ${
            selectedMethod === method.id
              ? "bg-white text-sky-950 shadow-sm"
              : "text-sky-800 hover:bg-white/60"
          }`}
        >
          <PaymentIcon type={method.icon} />
          {method.label}
        </button>
      ))}
    </div>
  );
}

function ProviderSelector({ provider, onProviderChange }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
        Select Provider
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {mobileMoneyProviders.map((option) => {
          const selected = provider === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onProviderChange(option.id)}
              className={`flex items-center justify-between rounded-xl border-2 p-5 text-left transition ${
                selected
                  ? "border-sky-900 bg-slate-50"
                  : "border-transparent bg-[#F1F2EA] hover:border-slate-200"
              }`}
            >
              <span>
                <span className="block text-lg font-bold text-sky-900">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm text-slate-500">
                  {option.description}
                </span>
              </span>
              {selected && (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-900 text-white">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="m6 12 4 4 8-8" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PaymentForm({
  selectedMethod,
  setSelectedMethod,
  provider,
  setProvider,
  accountName,
  setAccountName,
  phoneNumber,
  setPhoneNumber,
}) {
  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight text-sky-950 md:text-4xl">
        Payment Method
      </h1>

      <div className="mt-10">
        <MethodTabs
          selectedMethod={selectedMethod}
          onSelectMethod={setSelectedMethod}
        />
      </div>

      <div className="mt-10">
        {selectedMethod === "mobile_money" ? (
          <ProviderSelector provider={provider} onProviderChange={setProvider} />
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            This design is ready for card and bank payments, but the current
            backend payment endpoint is connected to Mobile Money providers.
          </div>
        )}
      </div>

      <div className="mt-8 space-y-6">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
            Account Holder Name
          </span>
          <input
            type="text"
            value={accountName}
            onChange={(event) => setAccountName(event.target.value)}
            placeholder="e.g. Jean-Paul Biya"
            className="mt-3 w-full rounded-full border-0 bg-[#DDDED7] px-7 py-5 text-lg text-slate-700 outline-none ring-1 ring-transparent placeholder:text-slate-400 focus:ring-sky-900"
          />
        </label>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
            Phone Number (6XX XXX XXX)
          </span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="+237 670 000 000"
            className="mt-3 w-full rounded-full border-0 bg-[#DDDED7] px-7 py-5 text-lg font-semibold text-slate-700 outline-none ring-1 ring-transparent placeholder:text-slate-400 focus:ring-sky-900"
          />
        </label>

        <div className="flex gap-4 rounded-xl bg-sky-100/80 px-5 py-5 text-sm leading-7 text-sky-950">
          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-900 text-white">
            <PaymentIcon type="info" />
          </span>
          <p>
            You will receive a prompt on your phone to authorize this
            transaction. Please keep your phone nearby and unlocked.
          </p>
        </div>
      </div>
    </section>
  );
}

function OrderSummary({
  apartment,
  bookingData,
  serviceFee,
  totalAmount,
  isPaying,
  paymentError,
  onPay,
  selectedMethod,
}) {
  return (
    <aside className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
      <div className="relative">
        <img
          src={apartment.image}
          alt={apartment.title}
          className="h-56 w-full object-cover"
        />
        <span className="absolute bottom-5 left-8 rounded-full bg-sky-900 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
          {apartment.location}
        </span>
      </div>

      <div className="p-7 md:p-10">
        <h2 className="text-2xl font-bold text-sky-950">{apartment.title}</h2>
        <p className="mt-2 text-base text-sky-800">
          {apartment.description || "Premium stay in Douala"}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-6 border-y border-slate-100 py-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Check-In
            </p>
            <p className="mt-2 font-semibold text-sky-900">
              {formatShortDate(bookingData.checkIn)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Check-Out
            </p>
            <p className="mt-2 font-semibold text-sky-900">
              {formatShortDate(bookingData.checkOut)}
            </p>
          </div>
        </div>

        <div className="space-y-4 border-b border-slate-100 py-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sky-900">
              {bookingData.nights} Nights x {formatCFA(apartment.price)}
            </p>
            <p className="font-medium text-slate-900">
              {formatCFA(bookingData.totalPrice)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sky-900">Service & Security Fee</p>
            <p className="font-medium text-slate-900">{formatCFA(serviceFee)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 py-6">
          <p className="text-lg font-bold text-sky-950">Total Amount</p>
          <p className="text-2xl font-bold text-sky-950">
            {formatCFA(totalAmount)}
          </p>
        </div>

        <button
          type="button"
          onClick={onPay}
          disabled={isPaying || selectedMethod !== "mobile_money"}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-sky-900 px-6 py-5 text-lg font-bold text-white shadow-lg shadow-sky-950/20 transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PaymentIcon type="lock" />
          {isPaying ? "Starting payment..." : "Pay & Confirm Booking"}
        </button>

        {paymentError && (
          <p className="mt-4 text-center text-sm text-red-600">
            {paymentError}
          </p>
        )}

        <p className="mt-8 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m6 12 4 4 8-8" />
            </svg>
          </span>
          Secure 256-bit SSL encrypted payment
        </p>
      </div>
    </aside>
  );
}

function PaymentFooter() {
  return (
    <footer className="border-t border-[#E7E8DE] bg-[#F1F2EA]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4 md:px-10 lg:px-16">
        <div>
          <h2 className="text-xl font-bold text-sky-950">Urban Sanctuary</h2>
          <p className="mt-6 max-w-sm leading-7 text-sky-800">
            Curating the finest stays in Douala&apos;s most prestigious
            neighborhoods.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-950">
            Company
          </p>
          <div className="mt-6 space-y-3 text-sky-800">
            <p>About Us</p>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-950">
            Host
          </p>
          <div className="mt-6 space-y-3 text-sky-800">
            <p>List Your Property</p>
            <p>Contact Support</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-950">
            Secure Booking
          </p>
          <div className="mt-6 flex gap-5 text-slate-500">
            <PaymentIcon type="card" />
            <PaymentIcon type="lock" />
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6Z" />
              <path d="m9 12 2 2 4-5" />
            </svg>
          </div>
        </div>
      </div>

      <div className="border-t border-[#E7E8DE] px-6 py-8 text-[11px] uppercase tracking-[0.18em] text-slate-500 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          (c) 2026 Urban Sanctuary Douala. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function Payment() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { apartment, isLoading: isLoadingApartment } = useApartmentResource(id);
  const { isAuthenticated } = useAuthToken();
  const bookingData = location.state;
  const [selectedMethod, setSelectedMethod] = useState("mobile_money");
  const [provider, setProvider] = useState("mtn_momo");
  const [accountName, setAccountName] = useState("");
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

  const serviceFee = Math.round((bookingData.totalPrice || 0) * 0.055);
  const totalAmount = (bookingData.totalPrice || 0) + serviceFee;

  const initiatePayment = async () => {
    setPaymentError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (selectedMethod !== "mobile_money") {
      setPaymentError("Only Mobile Money is connected to the backend for now.");
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
        provider,
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
      <CheckoutStepper />

      <main className="mx-auto grid max-w-7xl gap-12 px-6 pb-28 pt-8 md:px-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.8fr)] lg:px-16">
        <PaymentForm
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          provider={provider}
          setProvider={setProvider}
          accountName={accountName}
          setAccountName={setAccountName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />

        <OrderSummary
          apartment={apartment}
          bookingData={bookingData}
          serviceFee={serviceFee}
          totalAmount={totalAmount}
          isPaying={isPaying}
          paymentError={paymentError}
          onPay={initiatePayment}
          selectedMethod={selectedMethod}
        />
      </main>

      <PaymentFooter />
    </div>
  );
}
