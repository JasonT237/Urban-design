import DetailsSection from "./DetailsSection";

export default function LocationPreview({ location }) {
  return (
    <DetailsSection eyebrow="Where you'll be">
      <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[#F7F8F0]">
        <div className="flex h-[260px] items-center justify-center bg-[linear-gradient(to_right,#d9ddd3_1px,transparent_1px),linear-gradient(to_bottom,#d9ddd3_1px,transparent_1px)] bg-[size:28px_28px]">
          <div className="rounded-full bg-sky-900 px-4 py-2 text-sm font-medium text-white shadow-sm">
            {location}
          </div>
        </div>
      </div>
    </DetailsSection>
  );
}
