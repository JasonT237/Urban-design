export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-[#F7F8F0] px-6 py-24">
      <div className="mx-auto flex max-w-sm flex-col items-center rounded-[2rem] border border-[#E7E8DE] bg-white p-8 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-900/10">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-sky-900 border-t-transparent" />
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-sky-800">
          Urban Sanctuary
        </p>

        <h1 className="mt-2 text-xl font-semibold text-slate-900">
          {message}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Preparing the latest stay details for you.
        </p>
      </div>
    </div>
  );
}
