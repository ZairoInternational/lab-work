"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FlaskConical, Sparkles } from "lucide-react";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";

const SLIDE_MS = 650;
const AUTO_MS = 4000;
const CARD_HEIGHT = "min-h-[340px] h-[52vh] max-h-[520px] sm:min-h-[380px] sm:max-h-[560px] lg:min-h-[420px] lg:max-h-[600px]";

type CategoryRef = { _id?: string; name?: string; slug?: string };

export type ApiProduct = {
  _id: string;
  name: string;
  slug: string;
  images?: string | null;
  category?: CategoryRef | string | null;
};

function categorySlugOf(p: ApiProduct): string | null {
  const c = p.category;
  if (c && typeof c === "object" && "slug" in c && c.slug) return c.slug;
  return null;
}

function categoryNameOf(p: ApiProduct): string {
  if (typeof p.category === "object" && p.category?.name) return p.category.name;
  return "View product";
}

function productHref(p: ApiProduct): string {
  const catSlug = categorySlugOf(p);
  return catSlug != null ? `/products/${catSlug}/${p.slug}` : "/products";
}

function imageSrc(url: string | null | undefined): string {
  if (!url || !String(url).trim()) return "/assets/laboratory research.png";
  const u = String(url).trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return u.startsWith("/") ? u : `/${u}`;
}

function useItemsPerView(count: number) {
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      let n = 1;
      if (w >= 1536) n = 5;
      else if (w >= 1280) n = 4;
      else if (w >= 1024) n = 3;
      else if (w >= 640) n = 2;
      setItemsPerView(Math.min(n, Math.max(1, count)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [count]);

  return itemsPerView;
}

export default function ServicesSection() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animateSlide, setAnimateSlide] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const itemsPerView = useItemsPerView(products.length);
  const count = products.length;

  const loopProducts = useMemo(() => {
    if (count === 0) return [];
    return [...products, ...products, ...products];
  }, [products, count]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get<ApiProduct[]>("/api/products", { params: { featured: "true" } });
        if (!cancelled) {
          setProducts(Array.isArray(res.data) ? res.data : []);
          setLoadError(null);
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
          setLoadError("Could not load featured products.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (count > 0) setCurrentIndex(count);
  }, [count]);

  const trackShiftPercent =
    loopProducts.length > 0 ? (currentIndex * 100) / loopProducts.length : 0;

  const logicalIndex = count > 0 ? ((currentIndex % count) + count) % count : 0;

  const jumpTo = useCallback(
    (index: number) => {
      setAnimateSlide(false);
      setCurrentIndex(index);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateSlide(true));
      });
    },
    []
  );

  const goToNext = useCallback(() => {
    if (!count || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [count, isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (!count || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [count, isTransitioning]);

  useEffect(() => {
    if (!isTransitioning || count === 0) return;

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      if (currentIndex >= count * 2) {
        jumpTo(currentIndex - count);
      } else if (currentIndex < count) {
        jumpTo(currentIndex + count);
      }
    }, reduceMotion ? 0 : SLIDE_MS);

    return () => clearTimeout(timer);
  }, [isTransitioning, currentIndex, count, jumpTo, reduceMotion]);

  const canSlide = count > itemsPerView;

  useEffect(() => {
    if (!canSlide || isHovered || reduceMotion || isTransitioning) return;
    const interval = setInterval(goToNext, AUTO_MS);
    return () => clearInterval(interval);
  }, [canSlide, isHovered, reduceMotion, isTransitioning, goToNext]);

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-48px" },
        transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
      };

  return (
    <section
      className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-24"
      aria-labelledby="featured-products-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-slate-50/90 to-slate-100"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.12),transparent_55%)]"
      />

      {/* Header — contained */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div {...fade}>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" aria-hidden />
            Featured equipment
          </span>
          <h2
            id="featured-products-heading"
            className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
          >
            Laboratory{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Solutions
            </span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Precision-engineered equipment for modern research and analysis
          </p>
          {loadError && (
            <p className="mt-3 text-sm font-medium text-amber-700" role="alert">
              {loadError}
            </p>
          )}
        </motion.div>
      </div>

      {products.length === 0 ? (
        <motion.div
          {...fade}
          className="relative z-10 mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white/80 px-6 py-8 text-center shadow-sm"
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <FlaskConical className="h-6 w-6 text-slate-500" aria-hidden />
          </div>
          <p className="font-semibold text-slate-900">No featured products yet</p>
          <p className="mt-2 text-sm text-slate-600">
            In Admin → Products, enable <strong>Featured on homepage</strong> on the items you want here.
          </p>
        </motion.div>
      ) : (
        <motion.div
          {...fade}
          className="relative z-10 mt-10 w-full sm:mt-12"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Full-bleed carousel */}
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <motion.div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: `-${trackShiftPercent}%` }}
                transition={
                  !animateSlide || reduceMotion
                    ? { duration: 0 }
                    : { duration: SLIDE_MS / 1000, ease: [0.25, 0.1, 0.25, 1] }
                }
                style={{ width: `${(loopProducts.length * 100) / itemsPerView}%` }}
              >
                {loopProducts.map((product, index) => {
                  const href = productHref(product);
                  return (
                    <div
                      key={`${product._id}-${index}`}
                      className="shrink-0 px-2 sm:px-2.5"
                      style={{ width: `${100 / loopProducts.length}%` }}
                    >
                      <Link
                        href={href}
                        className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        <article
                          className={`relative overflow-hidden rounded-xl bg-slate-900 shadow-lg ring-1 ring-white/10 transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/15 sm:rounded-2xl ${CARD_HEIGHT}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageSrc(product.images)}
                            alt={product.name}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            loading={index < itemsPerView * 2 ? "eager" : "lazy"}
                          />
                          <div
                            className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-900/10"
                            aria-hidden
                          />
                          <div
                            className="absolute inset-0 bg-blue-600/0 transition-colors duration-300 group-hover:bg-blue-600/10"
                            aria-hidden
                          />
                          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300/90">
                              {categoryNameOf(product)}
                            </p>
                            <h3 className="mt-2 text-lg font-bold leading-tight text-white line-clamp-2 sm:text-xl lg:text-2xl">
                              {product.name}
                            </h3>
                          </div>
                        </article>
                      </Link>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {canSlide && (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  disabled={isTransitioning}
                  className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/95 text-slate-800 shadow-xl backdrop-blur-sm transition-all hover:bg-white hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 sm:left-6 sm:h-14 sm:w-14"
                  aria-label="Previous products"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  disabled={isTransitioning}
                  className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/95 text-slate-800 shadow-xl backdrop-blur-sm transition-all hover:bg-white hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 sm:right-6 sm:h-14 sm:w-14"
                  aria-label="Next products"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {canSlide && (
            <div className="mt-8 flex justify-center gap-1.5 px-4">
              {products.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (isTransitioning) return;
                    setIsTransitioning(true);
                    setAnimateSlide(true);
                    setCurrentIndex(count + index);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    logicalIndex === index ? "w-8 bg-blue-500" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                  aria-current={logicalIndex === index ? "true" : undefined}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
