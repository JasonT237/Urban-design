export default function ReviewsSection({ reviews }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800">
            Guest experiences
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            What guests are saying
          </h2>
        </div>

        <button className="text-sm font-medium text-sky-800 hover:text-sky-900">
          Show all 124 reviews
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="rounded-[1.5rem] bg-[#F7F8F0] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700">
          {review.initials}
        </div>
        <div>
          <p className="font-medium text-slate-900">{review.name}</p>
          <p className="text-xs text-slate-500">{review.date}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">"{review.quote}"</p>
    </div>
  );
}
