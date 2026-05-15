"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Medal, Sparkles, Star, Trophy } from "lucide-react";
import axios from "axios";

type Achievement = {
  _id: string;
  title: string;
  description: string;
  photo: string;
};

const CARD_ACCENTS = [
  "from-amber-400/20 via-orange-300/10 to-rose-200/20",
  "from-blue-400/25 via-indigo-300/15 to-violet-200/20",
  "from-emerald-400/20 via-teal-300/10 to-cyan-200/20",
  "from-fuchsia-400/20 via-pink-300/10 to-rose-200/15",
  "from-sky-400/25 via-blue-300/10 to-indigo-200/20",
];

function cardLayout(index: number): string {
  const mod = index % 6;
  if (mod === 0) return "md:col-span-2 md:row-span-2";
  if (mod === 3) return "md:col-span-2";
  return "";
}

export default function AchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    axios
      .get<Achievement[]>("/api/achievements")
      .then((res) => {
        if (!cancelled) {
          setItems(Array.isArray(res.data) ? res.data : []);
          setLoadError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setLoadError("Could not load achievements.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fadeUp = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const },
      };

  return (
    <div className="min-h-screen overflow-hidden bg-[#faf8ff]">
      {/* Hero */}
      <section className="relative pt-24 pb-20 sm:pt-28 sm:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(251,191,36,0.22),transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_20%,rgba(96,165,250,0.18),transparent_50%),radial-gradient(ellipse_50%_40%_at_0%_80%,rgba(167,139,250,0.15),transparent_50%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:48px_48px]"
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800 shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden />
            Our proudest moments
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Achievements that{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              shine
            </span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            Milestones earned through precision, partnership, and relentless quality—each one a chapter
            in the Benchtop Equipment story.
          </motion.p>

          {loadError ? (
            <p className="mt-4 text-sm font-medium text-amber-700" role="alert">
              {loadError}
            </p>
          ) : null}

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
          >
            <span className="inline-flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" aria-hidden />
              {items.length} milestone{items.length === 1 ? "" : "s"}
            </span>
            <span className="hidden h-4 w-px bg-slate-300 sm:block" aria-hidden />
            <span className="inline-flex items-center gap-2">
              <Medal className="h-4 w-4 text-blue-500" aria-hidden />
              Trusted worldwide
            </span>
          </motion.div>
        </div>

        {/* Floating decor */}
        <motion.div
          aria-hidden
          animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[8%] top-32 hidden h-16 w-16 items-center justify-center rounded-2xl bg-white/70 shadow-lg backdrop-blur-sm lg:flex"
        >
          <Star className="h-8 w-8 text-amber-400 fill-amber-400/30" />
        </motion.div>
        <motion.div
          aria-hidden
          animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="pointer-events-none absolute right-[10%] top-40 hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg lg:flex"
        >
          <Trophy className="h-7 w-7 text-white" />
        </motion.div>
      </section>

      {/* Gallery */}
      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <motion.div
              {...fadeUp}
              className="mx-auto max-w-lg rounded-3xl border border-dashed border-slate-200 bg-white/80 px-8 py-16 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100">
                <Trophy className="h-8 w-8 text-amber-600" aria-hidden />
              </div>
              <p className="text-lg font-semibold text-slate-900">Achievements coming soon</p>
              <p className="mt-2 text-sm text-slate-600">
                We are preparing our milestone gallery. Check back shortly.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(200px,auto)]">
              {items.map((item, index) => (
                <motion.article
                  key={item._id}
                  initial={fadeUp.initial}
                  whileInView={fadeUp.whileInView}
                  viewport={fadeUp.viewport}
                  transition={{
                    duration: 0.55,
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: reduceMotion ? 0 : index * 0.06,
                  }}
                  className={`group relative overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.15)] transition-shadow duration-500 hover:shadow-[0_28px_80px_-20px_rgba(59,130,246,0.2)] ${cardLayout(index)}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${CARD_ACCENTS[index % CARD_ACCENTS.length]} opacity-80`}
                    aria-hidden
                  />

                  <div className="relative flex h-full min-h-[220px] flex-col md:min-h-0">
                    <div className="relative aspect-[16/10] overflow-hidden md:absolute md:inset-0 md:aspect-auto">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.photo}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading={index < 4 ? "eager" : "lazy"}
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent md:from-slate-950/90"
                        aria-hidden
                      />
                    </div>

                    <div className="relative mt-auto p-5 sm:p-6 md:absolute md:inset-x-0 md:bottom-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-200 backdrop-blur-sm">
                        <Medal className="h-3 w-3" aria-hidden />
                        Milestone
                      </span>
                      <h2 className="mt-2 text-xl font-bold leading-snug text-white sm:text-2xl">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-200/95 line-clamp-3 sm:line-clamp-4">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl transition-opacity group-hover:opacity-100 opacity-60"
                    aria-hidden
                  />
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative mx-4 mb-16 max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-6 py-12 text-center shadow-2xl sm:mx-auto sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.15),transparent_50%)]"
        />
        <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-amber-300/90">
          What&apos;s next?
        </p>
        <h2 className="relative mt-3 text-2xl font-bold text-white sm:text-3xl">
          Let&apos;s build your next breakthrough together
        </h2>
        <Link
          href="/contact-us"
          className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          Get in touch
          <Sparkles className="h-4 w-4 text-amber-500" aria-hidden />
        </Link>
      </section>
    </div>
  );
}
