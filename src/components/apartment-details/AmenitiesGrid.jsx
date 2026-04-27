export default function AmenitiesGrid({ amenities }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {amenities.map((amenity) => (
        <div key={amenity.title} className="rounded-[1.5rem] bg-[#F7F8F0] p-5">
          <h3 className="text-base font-semibold text-slate-900">
            {amenity.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {amenity.description}
          </p>
        </div>
      ))}
    </div>
  );
}
