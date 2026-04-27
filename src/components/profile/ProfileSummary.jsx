export default function ProfileSummary() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[#E7E8DE] bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover ring-4 ring-[#F3E3D3]"
            />
            <button className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-sky-900 text-sm font-semibold text-white shadow-md transition hover:bg-sky-800">
              Edit
            </button>
          </div>

          <h2 className="mt-6 text-3xl font-semibold text-sky-900">
            Jean-Luc Ebene
          </h2>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Member since March 2024
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {["Verified Identity", "Bonapriso, Douala"].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl bg-[#F7F8F0] px-4 py-4 text-slate-700"
            >
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] bg-sky-900 p-6 text-white shadow-sm">
        <p className="text-lg font-semibold">Urban Elite Member</p>
        <p className="mt-3 text-sm leading-6 text-sky-100">
          You have unlocked priority booking for stays in Akwa and Bonapriso.
        </p>
      </div>
    </div>
  );
}
