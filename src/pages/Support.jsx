export default function Support() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-8 lg:px-10">
      <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-slate-400">
        Help Center
      </p>

      <h1 className="mb-4 text-3xl font-semibold tracking-tight text-sky-900 md:text-4xl">
        Support
      </h1>

      <p className="max-w-2xl text-base leading-7 text-slate-600">
        Need help with your reservation, payment, or apartment details? Our support
        page is here to guide you through common questions and booking assistance.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E7E8DE] bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-sky-900">
            Booking Assistance
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Get help with check-in dates, apartment availability, and reservation issues.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E7E8DE] bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-sky-900">
            Payment Help
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Find support for payment confirmation, billing concerns, and transaction questions.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E7E8DE] bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-sky-900">
            Apartment Information
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Learn more about amenities, locations, house rules, and stay details.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E7E8DE] bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-sky-900">
            Contact Support
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Reach out for direct help when you need more assistance with your stay.
          </p>
        </div>
      </div>
    </section>
  );
}