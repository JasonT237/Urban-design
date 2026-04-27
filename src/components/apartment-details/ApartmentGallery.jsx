export default function ApartmentGallery({ apartment }) {
  const sideImages = [1, 2];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-10">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <GalleryImage
          apartment={apartment}
          className="h-[420px] w-full object-cover transition hover:scale-[1.02]"
          wrapperClassName="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {sideImages.map((image) => (
            <GalleryImage
              key={image}
              apartment={apartment}
              className="h-[200px] w-full object-cover transition hover:scale-[1.02]"
              wrapperClassName="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryImage({ apartment, className, wrapperClassName }) {
  return (
    <div className={wrapperClassName}>
      <img src={apartment.image} alt={apartment.title} className={className} />
    </div>
  );
}
