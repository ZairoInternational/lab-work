"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  FileText,
  Headphones,
  Package,
  Shield,
} from "lucide-react";
import axios from "axios";

import CheckoutButton from "@/src/components/whatsappMessage";
import {
  defaultSpecTableMeta,
  getSpecTableTheme,
  parseSpecTableBundle,
} from "@/src/lib/specTable";

import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string | Category;
  images: string;
  pdf: string;
  shortDescription?: string;
  description?: string;
  specs?: Record<string, string | number> | {
    specTable?: string[][];
    specTableMeta?: {
      themeId?: string;
      moreInfoItems?: { heading: string; content: string; headingBold?: boolean }[];
      moreInfoLines?: string[];
      boldFirstRow?: boolean;
      boldFirstCol?: boolean;
      moreInfoHeading?: string;
      moreInfoBody?: string;
    };
  };
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type Props = {
  params: Promise<{ categorySlug: string; productSlug: string }>;
};

function formatUpdatedAt(iso?: string): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export default function ProductPage({ params }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categorySlug, setCategorySlug] = useState<string>("");
  const [productSlug, setProductSlug] = useState<string>("");

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setCategorySlug(resolvedParams.categorySlug);
      setProductSlug(resolvedParams.productSlug);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!productSlug || !categorySlug) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get<Product>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/particularProduct/${productSlug}`,
          { validateStatus: () => true }
        );

        if (res.status !== 200 || !res.data) {
          setError("Product not found");
          setProduct(null);
          return;
        }

        const productData = res.data;

        if (
          typeof productData.category === "object" &&
          productData.category.slug !== categorySlug
        ) {
          setError("Category mismatch");
          setProduct(null);
          return;
        }

        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug, categorySlug]);

  const specTableBundle = useMemo(
    () =>
      product
        ? parseSpecTableBundle(product.specs)
        : { rows: null as string[][] | null, meta: defaultSpecTableMeta() },
    [product]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100">
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
          <div className="pointer-events-none absolute inset-0 rounded-full bg-blue-500/15 blur-xl" />
        </div>
        <p className="mt-6 text-sm font-medium tracking-wide text-slate-600">
          Loading product…
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-slate-200/80">
            <Package className="h-10 w-10 text-slate-400" strokeWidth={1.25} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {error === "Category mismatch" ? "Wrong category" : "Product not found"}
          </h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            {error === "Category mismatch"
              ? "This product is not listed under the category in the URL."
              : "The product may have been moved or removed."}
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
          >
            Back to home
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const categoryName =
    typeof product.category === "object" ? product.category.name : "Products";
  const updatedLabel = formatUpdatedAt(product.updatedAt);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Ambient background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(59,130,246,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.08),transparent_40%)]" />
      </div>

      {/* Top bar — full width */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-end gap-1 text-xs font-medium text-slate-500 sm:flex sm:text-sm"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="truncate hover:text-blue-600">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <Link
              href={`/products/${categorySlug}`}
              className="truncate hover:text-blue-600"
            >
              {categoryName}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <span className="truncate text-slate-800">{product.name}</span>
          </nav>
        </div>
      </header>

      <article>
        {/* Hero — full bleed feel, no floating card */}
        <section className="border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50/90">
          <div className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-10 lg:pb-24 lg:pt-16 xl:px-14">
            <div className="mb-8 flex flex-wrap items-center gap-3 sm:hidden">
              <Link
                href="/"
                className="text-xs font-medium text-slate-500 hover:text-blue-600"
              >
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <Link
                href={`/products/${categorySlug}`}
                className="text-xs font-medium text-slate-500 hover:text-blue-600"
              >
                {categoryName}
              </Link>
            </div>

            <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
              {/* Gallery */}
              <div className="lg:col-span-7">
                <div className="relative mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/90 sm:aspect-[5/4] lg:aspect-auto lg:min-h-[min(72vh,760px)]">
                    {product.images ? (
                      <img
                        src={product.images}
                        alt={product.name}
                        className="h-full w-full object-contain p-6 sm:p-8 lg:p-12"
                      />
                    ) : (
                      <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
                        <Package
                          className="h-24 w-24 text-slate-300"
                          strokeWidth={1}
                        />
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-center text-xs text-slate-500 lg:text-left">
                    Product imagery — click below for a formal quote or instant
                    WhatsApp.
                  </p>
                </div>
              </div>

              {/* Copy + actions */}
              <div className="flex flex-col lg:col-span-5">
                <div className="space-y-6 lg:space-y-8">
                  {typeof product.category === "object" ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/products/${categorySlug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-800 transition hover:border-blue-200 hover:bg-blue-100"
                      >
                        {product.category.name}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                      </Link>
                      {updatedLabel ? (
                        <span className="text-xs text-slate-500">
                          Updated {updatedLabel}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08] xl:text-5xl">
                      {product.name}
                    </h1>
                    <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500" />
                  </div>

                  {product.shortDescription ? (
                    <p className="max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                      {product.shortDescription}
                    </p>
                  ) : (
                    <p className="max-w-xl text-base leading-relaxed text-slate-500">
                      Benchtop lab equipment — request a quote for pricing,
                      lead time, and documentation tailored to your lab.
                    </p>
                  )}

                  <div className="border border-slate-300 bg-slate-50/80 p-5 sm:p-6">
                    <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-3">
                      <span className="h-8 w-1 shrink-0 bg-blue-600" aria-hidden />
                      <div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-slate-500">
                          Actions
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          Quote, WhatsApp, or download
                        </p>
                      </div>
                    </div>
                    <CheckoutButton product={product} />
                  </div>

                  <ul className="mt-8 grid gap-px border border-slate-300 bg-slate-300 sm:grid-cols-3">
                    <li className="flex gap-4 bg-white p-5 sm:p-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-blue-700">
                        <Shield className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Lab-grade quality
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">
                          Equipment aligned with research and industry standards.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4 bg-white p-5 sm:p-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-indigo-700">
                        <FileText className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Clear documentation
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">
                          Specs and support materials to support procurement.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4 bg-white p-5 sm:p-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-sky-700">
                        <Headphones className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Human support
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">
                          Our team replies to enquiries and WhatsApp messages.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Long description */}
        {product.description ? (
          <section className="border-b border-slate-200/70 bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[880px] px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex items-start gap-4">
                <span className="mt-1 hidden h-10 w-1 shrink-0 rounded-full bg-blue-600 sm:block" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                    Overview
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    About this product
                  </h2>
                </div>
              </div>
              <div className="prose prose-slate prose-lg max-w-none prose-p:leading-relaxed prose-p:text-slate-700">
                <p className="whitespace-pre-line text-base leading-relaxed text-slate-700 sm:text-lg">
                  {product.description}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {/* Specifications table */}
        {specTableBundle.rows && specTableBundle.rows.length > 0
          ? (() => {
              const theme = getSpecTableTheme(specTableBundle.meta.themeId);
              const meta = specTableBundle.meta;
              const bulletItems = (meta.moreInfoItems ?? []).filter(
                (it) => it.heading.trim() || it.content.trim()
              );

              const cellFw = (ri: number, ci: number) => {
                if (
                  (meta.boldFirstRow && ri === 0) ||
                  (meta.boldFirstCol && ci === 0)
                ) {
                  return 700 as const;
                }
                return 400 as const;
              };

              return (
                <section className="border-b border-slate-200/70 bg-slate-100/60 py-16 sm:py-20 lg:py-24">
                  <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
                    <div className="mb-10 max-w-2xl">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
                        Technical data
                      </p>
                      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Specifications
                      </h2>
                      <p className="mt-3 text-slate-600">
                        Key parameters for this configuration. Contact us if you
                        need a customised build or alternate models.
                      </p>
                    </div>

                    <div
                      className="overflow-x-auto border bg-white shadow-sm"
                      style={{ borderColor: theme.border }}
                    >
                      <table
                        className="w-full min-w-[320px] border-collapse text-sm sm:text-base"
                        style={{ borderColor: theme.border }}
                      >
                        <tbody>
                          {specTableBundle.rows!.map((row, ri) => {
                            const isHeader = ri === 0;
                            const rowBg = isHeader
                              ? theme.headerBg
                              : ri % 2 === 1
                                ? theme.stripeBg
                                : theme.cellBg;
                            const textCol = isHeader
                              ? theme.headerText
                              : theme.cellText;
                            return (
                              <tr key={ri}>
                                {row.map((cell, ci) => (
                                  <td
                                    key={ci}
                                    className="px-3 py-2.5 whitespace-pre-wrap align-top sm:px-4 sm:py-3"
                                    style={{
                                      background: rowBg,
                                      color: textCol,
                                      border: `1px solid ${theme.border}`,
                                      fontWeight: cellFw(ri, ci),
                                    }}
                                  >
                                    {cell || "—"}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {bulletItems.length > 0 ? (
                        <div
                          className="border-t px-3 py-2.5 sm:px-4 sm:py-3"
                          style={{
                            borderColor: theme.border,
                            background: theme.cellBg,
                            color: theme.cellText,
                          }}
                        >
                          <ul className="m-0 list-disc space-y-1.5 pl-5 text-sm leading-relaxed sm:text-base">
                            {bulletItems.map((it, i) => {
                              const h = it.heading.trim();
                              const c = it.content.trim();
                              const boldH = it.headingBold !== false;
                              return (
                                <li key={i} className="marker:text-current">
                                  {h ? (
                                    <>
                                      <span
                                        style={{
                                          fontWeight: boldH ? 700 : 400,
                                        }}
                                      >
                                        {h}
                                      </span>
                                      {c ? <span aria-hidden>: </span> : null}
                                    </>
                                  ) : null}
                                  {c ? <span>{c}</span> : null}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </section>
              );
            })()
          : null}

        {/* Bottom CTA band */}
        <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 py-16 text-white sm:py-20">
          <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-10 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-10">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Need a formal quote or project support?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-blue-100 sm:text-base">
                Send an enquiry from our contact page or browse more equipment
                in this category. We respond to leads and WhatsApp during
                business hours.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
              >
                Contact us
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/products/${categorySlug}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                More in {categoryName}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
