import { connectDB } from "@/src/lib/db";
import SiteReview from "@/src/models/siteReview";

type ReviewDoc = {
  _id: unknown;
  name: string;
  rating: number;
  photo: string;
  body: string;
};

function StarRow({ rating }: { rating: number }) {
  const n = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 sm:h-4 sm:w-4 ${i < n ? "text-amber-400" : "text-slate-200"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function HomeVoicesFromTheBenchSection() {
  await connectDB();
  const raw = await SiteReview.find()
    .sort({ order: 1, createdAt: -1 })
    .limit(12)
    .lean<ReviewDoc[]>();

  if (!raw.length) return null;

  const reviews = raw.map((r) => ({
    id: String(r._id),
    name: r.name,
    rating: r.rating,
    photo: r.photo,
    body: r.body,
  }));

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-slate-100 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-1/4 top-0 h-[480px] w-[480px] rounded-full bg-blue-600/25 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-[420px] w-[420px] rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.3)_0%,rgba(15,23,42,0.92)_45%,rgb(15,23,42)_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-400">
            Voices from the bench
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            What teams say after the handover
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
            Honest words from people who live with the equipment every day—no scripts, no stock
            phrases, just how the experience felt on their floor.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {reviews.map((r, index) => {
            const accent =
              index % 3 === 0
                ? "from-blue-500/80 to-cyan-400/50"
                : index % 3 === 1
                  ? "from-indigo-500/80 to-violet-400/50"
                  : "from-sky-500/70 to-blue-500/50";
            return (
              <article
                key={r.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] backdrop-blur-sm transition duration-300 hover:border-white/18 hover:bg-white/[0.07]"
              >
                <div
                  className={`pointer-events-none absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${accent} opacity-90`}
                  aria-hidden
                />
                <div className="absolute right-4 top-5 font-serif text-5xl leading-none text-white/[0.06] transition group-hover:text-white/[0.1]">
                  &ldquo;
                </div>

                <div className="relative z-[1] flex items-start gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/15 ring-offset-2 ring-offset-slate-950">
                    <img
                      src={r.photo}
                      alt={r.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <StarRow rating={r.rating} />
                    <p className="mt-2 truncate text-sm font-semibold text-white">{r.name}</p>
                  </div>
                </div>

                <blockquote className="relative z-[1] mt-5 flex-1 text-sm leading-relaxed text-slate-300 sm:text-[0.9375rem] sm:leading-relaxed">
                  {r.body}
                </blockquote>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
