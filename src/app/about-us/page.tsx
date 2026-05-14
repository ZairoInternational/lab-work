"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Factory,
  FlaskConical,
  Globe2,
  Heart,
  HeartHandshake,
  MapPin,
  MessageSquareText,
  Microscope,
  Shield,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useSiteClients } from "@/src/hooks/use-site-clients";

type Stat = { label: string; value: number; suffix?: string };

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function Counter({
  value,
  suffix,
  durationMs = 1100,
  className,
}: {
  value: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setV(value);
      return;
    }
    const start = performance.now();
    const from = 0;
    const to = value;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, inView, reduceMotion, value]);

  return (
    <span ref={ref} className={className}>
      {v}
      {suffix ?? ""}
    </span>
  );
}

function Section({
  id,
  tone = "light",
  className,
  children,
}: {
  id?: string;
  tone?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cx(
        "relative scroll-mt-24 py-12 sm:py-14 lg:py-16",
        tone === "dark" && "text-white",
        className
      )}
    >
      {/* Section rhythm: alternating cool wash improves scan without new palette */}
      {tone !== "dark" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_100%_20%,rgba(96,165,250,0.06),transparent_55%)]"
        />
      )}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">{children}</div>
    </section>
  );
}

function Pill({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] transition-transform duration-300 hover:scale-[1.02]",
        tone === "dark"
          ? "border border-white/25 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
          : "border border-blue-400/35 bg-blue-400/12 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
      )}
    >
      <span className={cx("h-2 w-2 rounded-full", tone === "dark" ? "bg-blue-200" : "bg-blue-500")} />
      {children}
    </span>
  );
}

function GradientHeading({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={cx(
        "bg-clip-text text-transparent",
        tone === "dark"
          ? "bg-gradient-to-r from-white via-blue-100 to-blue-200"
          : "bg-gradient-to-r from-slate-950 via-slate-800 to-blue-600"
      )}
    >
      {children}
    </span>
  );
}

function SoftDivider({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div className="py-4 sm:py-6">
      <div
        className={cx(
          "h-px w-full",
          tone === "dark"
            ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
            : "bg-gradient-to-r from-transparent via-slate-900/10 to-transparent"
        )}
      />
    </div>
  );
}

/** Scroll-driven entrance: asymmetric ease reads “premium” vs linear motion */
function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px", amount: 0.12 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Glassmorphism base + specular rim; hover adds lift (micro-interaction) */
const glassPanel =
  "border border-white/60 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_12px_40px_-12px_rgba(15,23,42,0.12)]";
const glassHover =
  "transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-16px_rgba(37,99,235,0.2)] hover:border-blue-300/45";

const ABOUT_SERVICES = [
  {
    id: "manufacturing",
    title: "Manufacturing Partner",
    summary:
      "Working as manufacturing partner with top brands worldwide, offering the widest range of laboratory equipment.",
    details:
      "For some laboratory equipment and measuring instruments, we are working as a manufacturing partner with top brands worldwide. This helps our customers to choose from the widest range of laboratory equipment in one place.",
  },
  {
    id: "customer-service",
    title: "Customer Service",
    summary:
      "Unmatched customer service with excellent product delivery, information, and comprehensive support.",
    details:
      "We are committing to unmatched customer service for our clients worldwide. Whether there is a national or international deal at Benchtop Equipment, it promises excellent customer service in terms of product delivery, product information, and online and offline support.",
  },
  {
    id: "quality",
    title: "Guaranteed Quality",
    summary:
      "High-quality laboratory equipment with professional technical support and after-sales service.",
    details:
      "We have achieved extreme quality product performance while maintaining the personalized service you want. With a large team of professionally talented technical persons, marketing personnel, and customer service support Benchtop Equipment provides a guarantee of high-quality laboratory equipment and after-sales service. Our rework rate is very low as we employ the latest manufacturing and design technology. When it comes to machinery parts and other components used in Laboratory Equipment and Instruments, we use high-quality branded parts.",
  },
  {
    id: "customization",
    title: "Customized Solutions",
    summary:
      "One-on-one collaboration to design custom-built laboratory equipment for unique requirements.",
    details:
      "In response to a growing demand for specialized equipment, Benchtop Equipment works one-on-one with customers to design custom-built laboratory equipment. We specialize in designing that makes sense and believe in providing high-quality customization of laboratory equipment from little to critical modifications and have been serving our customers for years through almost everything they need to optimize their laboratories and workplace.",
  },
] as const;

const ABOUT_SPECIALTIES = [
  "Laboratory Equipment consultation",
  "Design, development, and distribution",
  "Direct import of equipment and spare parts",
  "Upgrade and special modifications in products of any brand",
  "Designs that make sense",
  "In-house CAD team",
  "Teamwork and Partnership",
  "Complete installation and commissioning at customers' workplace",
] as const;

const SUCCESS_REASONS = [
  "High-quality product",
  "Experienced and dedicated team",
  "Random and stringent test on product to ensure quality",
  "Affordable rates",
  "Highly acknowledge team",
  "Proper storage facilities and infrastructure",
  "Highly appreciated client management policies",
] as const;

function TestimonialCarousel() {
  const reduceMotion = useReducedMotion();
  const items = useMemo(
    () => [
      {
        name: "Research Lab Lead",
        role: "University Partner",
        quote:
          "Reliable performance, clean documentation, and fast support. The difference is felt in daily workflows.",
        rating: 5,
      },
      {
        name: "Quality Manager",
        role: "Healthcare Manufacturer",
        quote:
          "The equipment arrives consistent, calibrated, and production-ready. You can tell the process is disciplined.",
        rating: 5,
      },
      {
        name: "Procurement Head",
        role: "Diagnostics Network",
        quote:
          "Smooth ordering, great communication, and delivery that matches expectation. Strong long-term partner.",
        rating: 5,
      },
    ],
    []
  );
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((p) => (p - 1 + items.length) % items.length);
  const next = () => setIdx((p) => (p + 1) % items.length);

  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(400px_circle_at_30%_20%,rgba(96,165,250,0.20),transparent_60%),radial-gradient(360px_circle_at_80%_0%,rgba(15,23,42,0.12),transparent_55%)]" />
      <div
        className={cx(
          "relative overflow-hidden rounded-[32px] border border-white/55 bg-white/45 backdrop-blur-xl",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_16px_48px_-16px_rgba(15,23,42,0.14)]",
          "transition-shadow duration-500 hover:shadow-[0_24px_56px_-18px_rgba(37,99,235,0.22)]"
        )}
      >
        <div className="grid grid-cols-12 items-stretch">
          <div className="col-span-12 lg:col-span-8 p-8 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: items[idx]!.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-6 text-xl sm:text-2xl leading-relaxed text-slate-900 tracking-tight">
                  “{items[idx]!.quote}”
                </p>
                <div className="mt-8">
                  <div className="text-slate-900 font-semibold">{items[idx]!.name}</div>
                  <div className="text-slate-600">{items[idx]!.role}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="col-span-12 lg:col-span-4 p-8 sm:p-10 border-t lg:border-t-0 lg:border-l border-slate-900/10 bg-gradient-to-b from-white/40 to-white/[0.07] backdrop-blur-md">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-600">Testimonials</div>
            <div className="mt-3 text-3xl font-bold text-slate-900 tracking-tight">
              Voices that <span className="text-blue-600">trust</span> us
            </div>
            <div className="mt-8 flex gap-3">
              <motion.button
                type="button"
                whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                onClick={prev}
                className="h-12 w-12 rounded-full border border-slate-900/10 bg-white/80 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,1)] hover:border-blue-400/35 hover:bg-white transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 mx-auto text-slate-900" />
              </motion.button>
              <motion.button
                type="button"
                whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                onClick={next}
                className="h-12 w-12 rounded-full border border-slate-900/10 bg-white/80 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,1)] hover:border-blue-400/35 hover:bg-white transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 mx-auto text-slate-900" />
              </motion.button>
            </div>
            <div className="mt-8 space-y-2">
              {items.map((t, i) => (
                <motion.button
                  key={t.name}
                  type="button"
                  whileHover={reduceMotion ? undefined : { x: 4 }}
                  onClick={() => setIdx(i)}
                  className={cx(
                    "w-full text-left rounded-xl px-4 py-3 border transition-colors duration-200",
                    i === idx
                      ? "border-blue-400/50 bg-blue-500/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                      : "border-slate-900/10 bg-white/50 hover:bg-white/90 hover:border-slate-900/15"
                  )}
                >
                  <div className="text-slate-900 font-semibold">{t.name}</div>
                  <div className="text-slate-600 text-sm">{t.role}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutUsPage() {
  const reduceMotion = useReducedMotion();
  const siteClients = useSiteClients();
  const [expandedService, setExpandedService] = useState<string | null>(null);

  // Mouse-follow lighting for hero
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 90, damping: 20, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 90, damping: 20, mass: 0.4 });
  const heroSpot = useTransform([smx, smy], ([x, y]) => {
    return `radial-gradient(700px_circle_at_${x}px_${y}px, rgba(96,165,250,0.26), transparent 60%)`;
  });

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 36]);
  const heroY2 = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -18]);

  const stats: Stat[] = useMemo(
    () => [
      { label: "Years of excellence", value: 10, suffix: "+" },
      { label: "ISO-grade process", value: 2, suffix: " certs" },
      { label: "Client trust", value: 120, suffix: "+" },
      { label: "Product iterations", value: 480, suffix: "+" },
    ],
    []
  );

  const journey = useMemo(
    () => [
      { year: "2014", title: "The first build", desc: "We began with a simple promise: engineering discipline over shortcuts." },
      { year: "2017", title: "Systems & repeatability", desc: "Quality processes matured—testing became a culture, not a phase." },
      { year: "2020", title: "Scale with confidence", desc: "More categories, faster lead times, and better documentation." },
      { year: "2024", title: "Global partnerships", desc: "Trusted by teams across research, diagnostics, and industry." },
    ],
    []
  );

  const capabilities = useMemo(
    () => [
      {
        title: "Technical & quality",
        desc: "Professionally talented technical personnel supporting manufacturing, testing, and after-sales service.",
        Icon: Microscope,
      },
      {
        title: "Marketing & partnerships",
        desc: "Working as a manufacturing partner with top brands worldwide so customers can choose from the widest range in one place.",
        Icon: Globe2,
      },
      {
        title: "Customer service",
        desc: "Excellent delivery, clear product information, and responsive online and offline support for national and international customers.",
        Icon: HeartHandshake,
      },
      {
        title: "CAD & customization",
        desc: "In-house CAD and one-on-one collaboration for custom-built laboratory equipment—from small tweaks to critical modifications.",
        Icon: Wrench,
      },
    ],
    []
  );

  return (
    <main className="relative min-h-screen scroll-smooth overflow-hidden pb-16 sm:pb-20 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(96,165,250,0.22),transparent_55%),radial-gradient(900px_circle_at_90%_0%,rgba(59,130,246,0.18),transparent_45%),linear-gradient(to_bottom,rgba(239,246,255,1),rgba(255,255,255,1))]">
      {/* Lab graphics texture (subtle, site-wide) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.10] bg-[url('/assets/chem.png')] bg-repeat bg-[length:560px_560px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/30 to-white/80" />
      </div>

      {/* HERO */}
      <section
        ref={(el) => {
          heroRef.current = el;
        }}
        onMouseMove={(e) => {
          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
          mx.set(Math.max(0, e.clientX - r.left));
          my.set(Math.max(0, e.clientY - r.top));
        }}
        className="relative"
      >
        <motion.div aria-hidden="true" style={{ backgroundImage: heroSpot }} className="pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 pt-12 sm:pt-16 lg:pt-20 pb-8 lg:pb-12">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-6"
            >
              <Pill>About Benchtop</Pill>
              <h1 className="mt-7 text-5xl sm:text-6xl lg:text-[4.25rem] font-bold leading-[1.03] tracking-tight">
                <GradientHeading>Crafting precision equipment for the people who move science forward.</GradientHeading>
              </h1>
              <p className="mt-7 text-lg sm:text-xl text-slate-700 leading-relaxed max-w-2xl [text-wrap:balance]">
                ISO-certified laboratory equipment manufacturing with over 10 years of excellence—head office in Kanpur,
                serving laboratories worldwide with analytical instruments, equipment, and specialized tools for research,
                medical, and education. Manufacturing in state-of-the-art facilities in Kanpur and Ghaziabad.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact-us"
                  className="group inline-flex items-center gap-2 rounded-full px-7 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  Talk to us
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-4 border border-white/70 bg-white/55 backdrop-blur-xl text-slate-900 font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_28px_-8px_rgba(15,23,42,0.12)] hover:bg-white/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  Explore products
                  <TrendingUp className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div style={{ y: heroY }} className="lg:col-span-6">
              <div className="relative">
                <motion.div style={{ y: heroY2 }} className="absolute -top-10 -right-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
                <div
                  className={cx(
                    "relative rounded-[36px] overflow-hidden shadow-2xl shadow-blue-500/10",
                    glassPanel,
                    "transition-transform duration-500 hover:-translate-y-1"
                  )}
                >
                  <div className="grid grid-cols-12 gap-0">
                    <div className="col-span-7 p-4">
                      <div className="aspect-[4/3] rounded-[28px] overflow-hidden bg-slate-100 ring-1 ring-slate-900/5">
                        <motion.img
                          src="/assets/scientific analysis.png"
                          alt="Lab environment"
                          className="h-full w-full object-cover"
                          loading="lazy"
                          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <div className="col-span-5 p-4 pl-0 space-y-4">
                      <div className="aspect-[4/3] rounded-[28px] overflow-hidden bg-slate-100 ring-1 ring-slate-900/5">
                        <motion.img
                          src="/assets/laboratory research.png"
                          alt="Laboratory research"
                          className="h-full w-full object-cover"
                          loading="lazy"
                          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                        />
                      </div>
                      <div className="aspect-[4/3] rounded-[28px] overflow-hidden bg-slate-100 ring-1 ring-slate-900/5">
                        <motion.img
                          src="/assets/research tools.png"
                          alt="Research tools"
                          className="h-full w-full object-cover"
                          loading="lazy"
                          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-900/5 bg-slate-50/80 px-4 py-4 sm:px-5 sm:py-5">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                      {stats.map((s, i) => (
                        <motion.div
                          key={s.label}
                          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 + i * 0.04, duration: 0.4, ease: "easeOut" }}
                          whileHover={reduceMotion ? undefined : { y: -2 }}
                          className="rounded-2xl border border-slate-200/90 bg-white px-3 py-3.5 shadow-sm transition-shadow hover:shadow-md sm:px-4 sm:py-4"
                        >
                          <div className="text-2xl font-bold tabular-nums tracking-tight text-slate-950 sm:text-3xl">
                            <Counter value={s.value} suffix={s.suffix} />
                          </div>
                          <div className="mt-1 text-xs leading-snug text-slate-600 sm:text-sm">{s.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-slate-900 font-semibold">
                        <MapPin className="h-4 w-4 text-blue-600" aria-hidden="true" />
                        Kanpur, India
                      </div>
                      <div className="flex items-center gap-2 text-slate-900 font-semibold">
                        <BadgeCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />
                        ISO-grade process
                      </div>
                    </div>
                  </div>
                </div>

            
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BRAND INTRO — bento split: typographic anchor + frosted prose column (glassmorphism) */}
      <Section id="intro" className="pt-0">
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <Pill>Brand introduction</Pill>
                <h2 className="mt-7 text-4xl sm:text-5xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.08]">
                  <GradientHeading>Engineering that feels effortless.</GradientHeading>
                </h2>
              </div>
              <div
                aria-hidden="true"
                className="hidden lg:block flex-1 min-h-[140px] rounded-[32px] border border-blue-400/20 bg-gradient-to-br from-blue-500/12 via-white/40 to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              />
            </div>
            <div className="lg:col-span-7">
              <div
                className={cx(
                  "h-full rounded-[40px] p-8 sm:p-10 lg:p-12 text-slate-700 text-lg leading-relaxed space-y-6",
                  glassPanel,
                  glassHover
                )}
              >
                <h3 className="text-2xl font-bold text-slate-950 tracking-tight">Manufacturer of Laboratory Instruments & Furniture</h3>
                <p>
                  <strong className="text-slate-950">Benchtop Equipment Inc.</strong> is an ISO-certified laboratory equipment
                  manufacturing company in India. With our head office in Kanpur, we serve laboratories worldwide with
                  innovative solutions for research, medical, and educational sectors.
                </p>
                <p>
                  Our comprehensive product range includes analytical instruments, laboratory equipment, and specialized tools
                  that meet the daily challenges faced by scientists and researchers. All equipment is manufactured in our
                  state-of-the-art facilities in Kanpur and Ghaziabad.
                </p>
                <p className="text-slate-900 font-semibold">
                  We emphasize quality and customer service in every aspect of our work—outstanding responsiveness, execution,
                  and delivery of products.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Mission & Values — neumorphic-adjacent soft cards: inset highlight + hover lift */}
      <Section id="values" className="pt-0">
        <Reveal className="text-center max-w-3xl mx-auto mb-8">
          <Pill>Mission &amp; values</Pill>
          <h2 className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight">
            <GradientHeading>The principles behind every shipment.</GradientHeading>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              title: "Customer First",
              body: "Every customer is treated with utmost respect, cooperation and fairness as the cornerstone of our business.",
            },
            {
              title: "Integrity",
              body: "All employees conduct themselves with honesty and integrity in every aspect of our operations.",
            },
            {
              title: "Innovation",
              body: "We strive for the highest work ethic through cooperation, teamwork and innovation.",
            },
          ].map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06} className="h-full">
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className={cx(
                  "relative h-full overflow-hidden rounded-[28px] p-8 text-center",
                  glassPanel,
                  glassHover,
                  "shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-8px_24px_rgba(15,23,42,0.04)]"
                )}
              >
                <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(320px_circle_at_50%_0%,rgba(96,165,250,0.22),transparent_60%)]" />
                <div className="relative">
                  <h3 className="text-xl font-bold text-slate-950 tracking-tight">{v.title}</h3>
                  <p className="mt-4 text-slate-700 leading-relaxed">{v.body}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Section>

      <SoftDivider />

      {/* MISSION + VISION — depth cards: light glass vs dark “neumorphic” slab with inner rim */}
      <Section id="mission">
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-7">
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -5 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="relative rounded-[40px] overflow-hidden border border-white/60 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(96,165,250,0.22),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.78),rgba(255,255,255,0.42))] backdrop-blur-xl p-10 sm:p-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_24px_48px_-20px_rgba(15,23,42,0.12)]"
              >
                <Pill>Mission</Pill>
                <h3 className="mt-6 text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">Build equipment that earns trust at scale.</h3>
                <p className="mt-5 text-slate-700 text-lg leading-relaxed max-w-2xl">
                  We deliver ISO‑grade quality, clear documentation, and responsive support—so every installation performs
                  reliably from day one through years of use.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  {[
                    { Icon: ShieldCheck, label: "Repeatable quality" },
                    { Icon: Wrench, label: "Service-first support" },
                    { Icon: Factory, label: "Modern manufacturing" },
                  ].map((x) => (
                    <motion.span
                      key={x.label}
                      whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 border border-slate-900/10 bg-white/75 backdrop-blur-sm text-slate-900 font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,1)]"
                    >
                      <x.Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                      {x.label}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-5">
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -5 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="relative h-full rounded-[40px] overflow-hidden border border-white/10 bg-gradient-to-br from-slate-950 to-slate-900 text-white p-10 sm:p-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_28px_56px_-18px_rgba(0,0,0,0.45)]"
              >
                <Pill tone="dark">Vision</Pill>
                <h3 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight">
                  <GradientHeading tone="dark">A calmer future for every lab.</GradientHeading>
                </h3>
                <p className="mt-5 text-blue-100/85 text-lg leading-relaxed">
                  Create a world where equipment quality is predictable, installation is smooth, and labs can move faster—without risk.
                </p>
                <div className="mt-10 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <Clock className="h-5 w-5 text-blue-200" aria-hidden="true" />
                    <div className="mt-3 font-semibold">Faster execution</div>
                    <div className="text-blue-100/75 text-sm mt-1">Less friction, clearer outcomes</div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <Globe2 className="h-5 w-5 text-blue-200" aria-hidden="true" />
                    <div className="mt-3 font-semibold">Global trust</div>
                    <div className="text-blue-100/75 text-sm mt-1">Consistency across locations</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Comprehensive solutions — staggered reveal + layout-smooth expand (micro-interaction) */}
      <Section id="services" className="pt-0">
        <Reveal className="text-center max-w-3xl mx-auto mb-8">
          <Pill>What we deliver</Pill>
          <h2 className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight">
            <GradientHeading>Comprehensive Laboratory Solutions</GradientHeading>
          </h2>
          <p className="mt-7 text-slate-700 text-lg leading-relaxed">
            We emphasize quality and customer service that our customers find in all aspects of our work. We serve our
            customers with outstanding responsiveness, execution, and delivery of products.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {ABOUT_SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.05}>
              <motion.div
                className={cx("relative overflow-hidden rounded-[28px] p-7 sm:p-8", glassPanel, glassHover)}
              >
                <h3 className="text-xl font-bold text-slate-950 tracking-tight">{service.title}</h3>
                <p className="mt-3 text-slate-700 leading-relaxed">{service.summary}</p>
                <motion.button
                  type="button"
                  onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 rounded-lg px-1 py-1 -mx-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  {expandedService === service.id ? "Show less" : "Learn more"}
                  <motion.span animate={{ rotate: expandedService === service.id ? 180 : 0 }} transition={{ duration: 0.28 }}>
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </motion.span>
                </motion.button>
                <AnimatePresence initial={false}>
                  {expandedService === service.id && (
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="mt-5 pt-5 border-t border-slate-900/10"
                    >
                      <p className="text-slate-700 leading-relaxed">{service.details}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Specialties — dense grid with tactile chips */}
      <Section id="specialties" className="pt-2">
        <Reveal className="text-center max-w-3xl mx-auto mb-8">
          <Pill>Capabilities</Pill>
          <h2 className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight">
            <GradientHeading>Our Specialties</GradientHeading>
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ABOUT_SPECIALTIES.map((specialty, i) => (
            <Reveal key={specialty} delay={Math.min(i * 0.04, 0.2)}>
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={cx(
                  "rounded-2xl p-6 space-y-3 h-full",
                  glassPanel,
                  "border border-slate-900/10 hover:border-blue-400/35 transition-colors duration-300"
                )}
              >
                <div className="h-9 w-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <FlaskConical className="h-4 w-4 text-blue-700" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-slate-950 text-sm leading-snug tracking-tight">{specialty}</h3>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* JOURNEY — vertical rhythm + parallax-adjacent scroll cues on copy blocks */}
      <Section id="journey" className="pb-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28 self-start">
            <Pill>Our story</Pill>
            <h2 className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight">
              <GradientHeading>Journey, built in chapters.</GradientHeading>
            </h2>
            <p className="mt-7 text-slate-700 text-lg leading-relaxed max-w-md">
              A timeline that reads like a product narrative—systems, iteration, scale, and trust.
            </p>
          </Reveal>
          <div className="lg:col-span-7">
            <div className="relative pl-2 sm:pl-0">
              <div className="absolute left-[15px] sm:left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-400/40 via-slate-900/12 to-transparent" />
              <div className="space-y-12">
                {journey.map((j, i) => (
                  <motion.div
                    key={j.year}
                    initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: Math.min(i * 0.06, 0.2) }}
                    className="group relative pl-12 sm:pl-14"
                  >
                    <motion.div
                      className="absolute left-0 top-2 h-7 w-7 rounded-full border border-blue-400/35 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,1),0_6px_16px_-6px_rgba(37,99,235,0.35)]"
                      whileHover={reduceMotion ? undefined : { scale: 1.12 }}
                    />
                    <div className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-blue-600/90">{j.year}</div>
                    <div className="mt-2 text-2xl sm:text-[1.65rem] font-bold text-slate-950 tracking-tight">{j.title}</div>
                    <div className="mt-3 text-slate-700 text-lg leading-relaxed max-w-xl">{j.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Reasons for success — split panel with “floating” media frame */}
      <Section id="success" className="pt-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <Reveal className="lg:col-span-6">
            <Pill>Why customers stay</Pill>
            <h2 className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight">
              <GradientHeading>Reasons for Our Success</GradientHeading>
            </h2>
            <ul className="mt-10 space-y-5">
              {SUCCESS_REASONS.map((reason, i) => (
                <motion.li
                  key={reason}
                  initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: Math.min(i * 0.05, 0.25), duration: 0.4 }}
                  className="flex items-start gap-4 text-slate-700 text-lg leading-relaxed"
                >
                  <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.55)]" aria-hidden="true" />
                  {reason}
                </motion.li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-6">
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -6, rotate: -0.3 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className={cx("relative rounded-[32px] overflow-hidden p-4 sm:p-6", glassPanel)}
            >
              <div className="rounded-2xl overflow-hidden ring-1 ring-slate-900/10 bg-slate-50/80">
                <motion.img
                  src="/clients/success.png"
                  alt="Benchtop Equipment success"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  transition={{ duration: 0.45 }}
                />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </Section>

      {/* Clients — logo wall with magnetic hover (depth via shadow + scale) */}
      <Section id="clients" className="pt-6">
        <Reveal className="text-center max-w-3xl mx-auto mb-8">
          <Pill>Trust</Pill>
          <h2 className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight">
            <GradientHeading>Clients We Have Worked With</GradientHeading>
          </h2>
          <p className="mt-7 text-slate-700 text-lg leading-relaxed">
            Trusted by leading organizations across healthcare, research, education, and industry sectors worldwide.
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <div className={cx("rounded-[32px] p-6 sm:p-10", glassPanel)}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 sm:gap-7 items-center">
              {siteClients.map((c, i) => (
                <motion.div
                  key={c._id}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: Math.min(i * 0.03, 0.18), duration: 0.4 }}
                  whileHover={reduceMotion ? undefined : { y: -4, scale: 1.03 }}
                  className="aspect-[3/2] rounded-xl border border-slate-900/10 bg-white/70 flex items-center justify-center p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]"
                >
                  <img src={c.logo} alt={c.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Strengths & capabilities — asymmetric grid + glass depth */}
      <Section id="team" className="pt-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <Reveal className="lg:col-span-5">
            <Pill>People &amp; process</Pill>
            <h2 className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight">
              <GradientHeading>How the work actually gets done.</GradientHeading>
            </h2>
            <p className="mt-7 text-slate-700 text-lg leading-relaxed">
              Technical talent, marketing reach, customer support, and in-house design—working together so every engagement
              feels consistent from first conversation to commissioning.
            </p>
          </Reveal>
          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-6">
              {capabilities.map((card, i) => {
                const CardIcon = card.Icon;
                return (
                <motion.div
                  key={card.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: Math.min(i * 0.06, 0.18) }}
                  whileHover={reduceMotion ? undefined : { y: -8, scale: 1.015 }}
                  className={cx("group relative overflow-hidden rounded-[28px] p-7", glassPanel, glassHover)}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(300px_circle_at_30%_0%,rgba(96,165,250,0.18),transparent_60%)]" />
                  <div className="relative">
                    <CardIcon className="h-7 w-7 text-blue-600" aria-hidden="true" />
                    <div className="mt-5 text-slate-950 font-bold text-lg tracking-tight">{card.title}</div>
                    <p className="mt-2 text-slate-700 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* WHY CHOOSE US — bento tiles with directional hover lighting */}
      <Section id="why" className="pt-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <Reveal className="lg:col-span-5">
            <Pill>Why choose us</Pill>
            <h2 className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight">
              <GradientHeading>Premium trust, made tangible.</GradientHeading>
            </h2>
            <p className="mt-7 text-slate-700 text-lg leading-relaxed">
              We communicate trust through process, documentation, and outcomes—visibly.
            </p>
          </Reveal>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-12 gap-5">
              {[
                {
                  title: "ISO-grade discipline",
                  desc: "Repeatable testing, traceable builds, consistent outcomes.",
                  Icon: ShieldCheck,
                  span: "col-span-12 sm:col-span-7",
                },
                {
                  title: "Service that responds",
                  desc: "Human support with clear timelines and fast follow-up.",
                  Icon: HeartHandshake,
                  span: "col-span-12 sm:col-span-5",
                },
                {
                  title: "Modern manufacturing",
                  desc: "Facilities and methods built for reliability at scale.",
                  Icon: Factory,
                  span: "col-span-12 sm:col-span-5",
                },
                {
                  title: "Precision engineering",
                  desc: "Designed for performance, built for durability.",
                  Icon: Wrench,
                  span: "col-span-12 sm:col-span-7",
                },
              ].map((x, i) => (
                <motion.div
                  key={x.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: Math.min(i * 0.05, 0.18) }}
                  whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
                  className={cx(
                    "group relative overflow-hidden rounded-[34px] p-7 sm:p-8",
                    glassPanel,
                    glassHover,
                    x.span
                  )}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(420px_circle_at_30%_0%,rgba(96,165,250,0.2),transparent_60%)]" />
                  <div className="relative">
                    <x.Icon className="h-7 w-7 text-blue-600" aria-hidden="true" />
                    <div className="mt-5 text-slate-950 font-bold text-xl tracking-tight">{x.title}</div>
                    <div className="mt-2 text-slate-700 leading-relaxed">{x.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CULTURE — mosaic media with parallax-like hover zoom (contained overflow) */}
      <Section id="culture" className="pt-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <Reveal className="lg:col-span-6">
            <Pill>Behind the scenes</Pill>
            <h2 className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight">
              <GradientHeading>Work culture, quietly high‑standards.</GradientHeading>
            </h2>
            <p className="mt-7 text-slate-700 text-lg leading-relaxed">
              Calm execution. Clear ownership. Systems that reduce chaos—and create predictable delivery.
            </p>
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-6">
            <div className={cx("relative rounded-[40px] overflow-hidden", glassPanel)}>
              <div className="grid grid-cols-2">
                {[
                  { src: "/assets/lab work.png", alt: "Behind the scenes" },
                  { src: "/assets/homepage-banner2.png", alt: "Manufacturing" },
                  { src: "/assets/homepage-banner1.png", alt: "Research" },
                  { src: "/assets/homepage-banner3.png", alt: "Quality process" },
                ].map((img) => (
                  <div key={img.src} className="aspect-square overflow-hidden bg-slate-100">
                    <motion.img
                      src={img.src}
                      alt={img.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap gap-3">
                  {[
                    { Icon: Users, label: "Ownership" },
                    { Icon: Award, label: "Craft" },
                    { Icon: FlaskConical, label: "Experimentation" },
                    { Icon: ShieldCheck, label: "Discipline" },
                  ].map((x) => (
                    <motion.span
                      key={x.label}
                      whileHover={reduceMotion ? undefined : { y: -2, scale: 1.03 }}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white/85 backdrop-blur-md border border-white/50 text-slate-900 font-semibold shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]"
                    >
                      <x.Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                      {x.label}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Quality policy, positioning, philosophy, CSR — long-form content in layered glass frames */}
      <Section id="quality" className="pt-6">
        <Reveal>
          <div id="quality-policy" className={cx("max-w-4xl mx-auto rounded-[40px] p-8 sm:p-12 lg:p-14", glassPanel)}>
            <div className="text-center mb-6">
              <Pill>Standards</Pill>
              <h2 className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight">
                <GradientHeading>Quality Policy &amp; Standards</GradientHeading>
              </h2>
            </div>
            <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
              <p>
                We believe in providing quality at the highest level. The fact that we are in a business that is directly
                linked to the health and well-being of the people makes us a more responsible company, and no matter what,
                no compromises are made.
              </p>
              <p className="font-semibold text-slate-950 text-center">No doubt, life is precious.</p>
              <p>
                Not only do our products conform to{" "}
                <span className="font-semibold text-blue-700">ISO 9001:2015</span>,{" "}
                <span className="font-semibold text-blue-700">ISO 13485:2016</span>, and{" "}
                <span className="font-semibold text-blue-700">CE standards</span>, but we also constantly exceed
                international quality norms.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              {["ISO 9001:2015", "ISO 13485:2016", "CE Certified"].map((label) => (
                <motion.span
                  key={label}
                  whileHover={reduceMotion ? undefined : { y: -3, scale: 1.04 }}
                  className="rounded-xl border border-blue-500/30 bg-blue-500/12 px-6 py-3 font-semibold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                >
                  {label}
                </motion.span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div id="different" className="mt-20 lg:mt-28">
            <div className="text-center mb-8">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-950 tracking-tight">How Are We Different?</h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-blue-600 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  Icon: Award,
                  title: "25 Years Experience",
                  body: "Our innovative approach, personalized services, and impressive growth rate have positioned us at the No. 1 spot.",
                },
                {
                  Icon: Shield,
                  title: "Quality First",
                  body: "We don't compromise on quality in exchange for a cheaper price. We go beyond mandatory standards.",
                },
                {
                  Icon: Building2,
                  title: "Modern Facilities",
                  body: "State-of-the-art manufacturing facilities with rigorous quality assurance resources.",
                },
              ].map((item) => {
                const ItemIcon = item.Icon;
                return (
                <motion.div
                  key={item.title}
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  className={cx("rounded-[28px] p-8 shadow-sm", glassPanel, glassHover)}
                >
                  <ItemIcon className="h-10 w-10 text-blue-600" aria-hidden="true" />
                  <h3 className="mt-6 text-xl font-bold text-slate-950 tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-slate-700 leading-relaxed">{item.body}</p>
                </motion.div>
              );
              })}
            </div>
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.005 }}
              className={cx("mt-10 rounded-[28px] p-8 sm:p-10 text-center", glassPanel)}
            >
              <p className="text-lg text-slate-700 leading-relaxed max-w-4xl mx-auto">
                Many importers in Europe sell our products under their brands. This itself is a testimony to acceptance of our
                core competencies in quality control, product design &amp; development, prototyping, packaging, and
                sterilization.
              </p>
            </motion.div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div id="philosophy" className="mt-20 lg:mt-28 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-950 tracking-tight">Company&apos;s Philosophy</h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-blue-600 mx-auto" />
            <div className="mt-10 space-y-6 text-slate-700 text-lg leading-relaxed text-left">
              <p>
                Being in a business that has to take care of the health and well-being of people, we ensure that no
                compromises are made. No doubt, we understand that life is precious.
              </p>
              <p>
                Since the beginning, our business philosophy has been based on{" "}
                <span className="font-semibold text-blue-700">exceptional service</span>,{" "}
                <span className="font-semibold text-blue-700">high quality</span>, and{" "}
                <span className="font-semibold text-blue-700">value</span>.
              </p>
              <p className="font-semibold text-slate-950 text-center">
                At Benchtop Equipment, quality is a culture and service a tradition.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div id="csr" className="mt-20 lg:mt-28 grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <Pill>Scope</Pill>
              <h2 className="mt-7 text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">What We Do</h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-blue-600" />
              <p className="mt-8 text-slate-700 text-lg leading-relaxed">
                We manufacture and supply analytical instruments, laboratory equipment and furniture, measuring instruments,
                spare parts, and specialized tools for research, medical, and educational laboratories—supporting
                distributors and end users with installation and commissioning where required.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { Icon: FlaskConical, label: "Research & clinical labs" },
                  { Icon: ShieldCheck, label: "Quality-assured supply" },
                  { Icon: Building2, label: "Facilities: Kanpur & Ghaziabad" },
                  { Icon: Award, label: "Spares, upgrades & mods" },
                ].map((cell) => {
                  const CellIcon = cell.Icon;
                  return (
                  <motion.div
                    key={cell.label}
                    whileHover={reduceMotion ? undefined : { y: -3 }}
                    className={cx("flex items-center gap-3 rounded-xl p-4", glassPanel, "border border-slate-900/10")}
                  >
                    <CellIcon className="h-6 w-6 shrink-0 text-blue-600" aria-hidden="true" />
                    <span className="text-sm font-medium text-slate-900 leading-snug">{cell.label}</span>
                  </motion.div>
                );
                })}
              </div>
              <p className="mt-8 text-slate-600 leading-relaxed">
                We aim to offer a wide range of laboratory solutions in one place—from standard equipment to tailored
                modifications—so teams can optimize their laboratories and workplaces with confidence.
              </p>
            </div>
            <div>
              <Pill>Responsibility</Pill>
              <h2 className="mt-7 text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">Corporate Social Responsibility</h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-blue-600" />
              <div className="mt-8 space-y-6">
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  className={cx("rounded-[28px] p-8", glassPanel, glassHover)}
                >
                  <Users className="h-10 w-10 text-blue-600 mb-6" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-slate-950 tracking-tight">Ethical Practices</h3>
                  <p className="mt-3 text-slate-700 leading-relaxed">
                    We do not employ child labor and maintain the highest ethical standards in all our operations.
                  </p>
                </motion.div>
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  className={cx("rounded-[28px] p-8", glassPanel, glassHover)}
                >
                  <Heart className="h-10 w-10 text-blue-600 mb-6" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-slate-950 tracking-tight">Community Support</h3>
                  <p className="mt-3 text-slate-700 leading-relaxed">
                    We regularly donate to NGOs, the Army & government welfare funds, contributing to society's
                    well-being.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

    

    </main>
  );
}

