"use client";

import { useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useSiteClients, type SiteClientDisplay } from "@/src/hooks/use-site-clients";

function PartnerTile({ c }: { c: SiteClientDisplay }) {
  return (
    <div className="group flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-[transform,background-color,border-color] duration-300 hover:-translate-y-0.5 hover:border-blue-400/35 hover:bg-white/[0.12] sm:gap-4 sm:px-5 sm:py-3.5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/90 p-1.5 shadow-sm ring-1 ring-slate-900/5 sm:h-12 sm:w-12">
        {/* eslint-disable-next-line @next/next/no-img-element -- mixed remote + public paths */}
        <img src={c.logo} alt={c.name} className="max-h-full max-w-full object-contain" loading="lazy" />
      </div>
      <span className="max-w-[10rem] truncate text-xs font-semibold tracking-tight text-blue-50/95 sm:max-w-[14rem] sm:text-sm">
        {c.name}
      </span>
    </div>
  );
}

function MarqueeTrack({
  reverse,
  paused,
  clients,
}: {
  reverse?: boolean;
  paused: boolean;
  clients: SiteClientDisplay[];
}) {
  return (
    <div className="relative overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className={`flex w-max gap-6 sm:gap-10 ${
          paused ? "" : reverse ? "animate-clients-marquee-scroll-reverse" : "animate-clients-marquee-scroll"
        }`}
      >
        {clients.map((c) => (
          <PartnerTile key={`${c._id}-a`} c={c} />
        ))}
        {clients.map((c) => (
          <PartnerTile key={`${c._id}-b`} c={c} />
        ))}
      </div>
    </div>
  );
}

export default function HomePartnersSection() {
  const clients = useSiteClients();
  const reduceMotion = useReducedMotion();
  const paused = Boolean(reduceMotion);

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 text-white sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_30%,rgba(96,165,250,0.18),transparent_55%),radial-gradient(700px_circle_at_90%_20%,rgba(59,130,246,0.12),transparent_50%)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:48px_100%] opacity-40" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200/90">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" aria-hidden />
            Trusted partners
          </span>
          <h2 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Organizations we&apos;re proud to support
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Research, healthcare, education, and industry teams worldwide rely on our equipment and support.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-1 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-white/5 backdrop-blur-sm">
          <div className="rounded-[22px] bg-slate-950/40 px-2 py-4 sm:px-4 sm:py-5">
            <MarqueeTrack paused={paused} clients={clients} />
            <div className="my-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <MarqueeTrack reverse paused={paused} clients={clients} />
          </div>
        </div>
      </div>
    </section>
  );
}
