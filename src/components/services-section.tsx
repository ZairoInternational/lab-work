"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

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

function imageSrc(url: string | null | undefined): string {
  if (!url || !String(url).trim()) return "/assets/laboratory research.png";
  const u = String(url).trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return u.startsWith("/") ? u : `/${u}`;
}

export default function ProductCarousel() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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

  const itemsPerView = useMemo(
    () => Math.min(5, Math.max(1, products.length || 1)),
    [products.length]
  );

  const extendedProducts = useMemo(() => {
    if (products.length === 0) return [];
    return [...products, ...products, ...products];
  }, [products]);

  useEffect(() => {
    if (!products.length) return;
    if (currentIndex >= products.length) setCurrentIndex(0);
  }, [products.length, currentIndex]);

  useEffect(() => {
    if (products.length === 0 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= products.length) return 0;
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length, isHovered]);

  const goToPrevious = () => {
    if (!products.length) return;
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (!products.length) return;
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  return (
    <div className="relative py-6 sm:py-8">
      <div className="relative container min-w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl shadow-md">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"
                />
              </svg>
            </div>
            <div className="h-px w-12 bg-gradient-to-r from-slate-300 to-transparent" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Laboratory Solutions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Precision-engineered equipment for modern research and analysis
          </p>
          {loadError && <p className="mt-4 text-sm text-amber-700">{loadError}</p>}
        </div>

        {products.length === 0 ? (
          <div className="max-w-md mx-auto text-center rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-8 text-slate-600 text-sm">
            <p className="font-medium text-slate-800">No featured products yet</p>
            <p className="mt-2 text-sm">
              In Admin → Products, edit a product and enable <strong>Featured on homepage</strong>, or toggle Featured in
              the product list.
            </p>
          </div>
        ) : (
          <div
            className="relative max-w-5xl mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="overflow-hidden rounded-xl backdrop-blur-sm border border-white/20 p-3 sm:p-4">
              <div
                className="flex transition-transform duration-700 ease-out gap-3 sm:gap-4"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                  width: `${(extendedProducts.length * 20) / itemsPerView}%`,
                }}
              >
                {extendedProducts.map((product, index) => {
                  const catSlug = categorySlugOf(product);
                  const href =
                    catSlug != null
                      ? `/products/${catSlug}/${product.slug}`
                      : `/products`;
                  return (
                    <div
                      key={`${product._id}-${index}`}
                      className="group relative flex-shrink-0"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl">
                        <div className="relative h-28 sm:h-32 md:h-36 w-full rounded-xl overflow-hidden bg-white shadow-md group-hover:shadow-lg transition-all duration-500">
                          <img
                            src={imageSrc(product.images)}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                          <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-white font-semibold text-xs sm:text-sm mb-0.5 leading-snug line-clamp-2">{product.name}</h3>
                            <p className="text-white/80 text-[11px] sm:text-xs font-medium truncate">
                              {typeof product.category === "object" && product.category?.name
                                ? product.category.name
                                : "View product"}
                            </p>
                          </div>
                          <div className="absolute inset-0 rounded-xl ring-2 ring-slate-400/0 group-hover:ring-slate-400/25 transition-all duration-500" />
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-2 w-9 h-9 sm:w-10 sm:h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 hover:shadow-lg transition-all duration-300 group z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-2 w-9 h-9 sm:w-10 sm:h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 hover:shadow-lg transition-all duration-300 group z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            <div className="flex justify-center gap-1.5 mt-4">
              {products.slice(0, Math.ceil(products.length / itemsPerView)).map((_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerView)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / itemsPerView) === index
                      ? "bg-slate-800 w-8"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide group ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute top-1/4 right-4 w-2 h-2 bg-blue-400/15 rounded-full" />
        <div className="pointer-events-none absolute top-1/3 left-4 w-1.5 h-1.5 bg-slate-400/20 rounded-full" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-2 h-2 bg-blue-300/10 rounded-full" />
      </div>
    </div>
  );
}
