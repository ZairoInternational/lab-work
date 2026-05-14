import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Package } from "lucide-react";
import { connectDB } from "../../../lib/db";
import CategoryModel from "../../../models/category";
import ProductModel from "../../../models/product";

type Props = { params: Promise<{ categorySlug: string }> };

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: unknown;
  name: string;
  slug: string;
  category: string;
  images?: string;
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;

  await connectDB();

  const category = await CategoryModel.findOne({ slug: categorySlug }).lean<
    Category | null
  >();
  if (!category) return notFound();

  const products = await ProductModel.find({ category: category._id })
    .select("-price")
    .sort({ updatedAt: -1 })
    .lean<Product[]>();

  const count = products.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(59,130,246,0.11),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.07),transparent_42%)]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            ← Home
          </Link>
          <nav
            className="flex min-w-0 flex-1 items-center justify-end gap-1 text-xs font-medium text-slate-500 sm:text-sm"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="truncate hover:text-blue-600">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-45" />
            <span className="truncate text-slate-800">{category.name}</span>
          </nav>
        </div>
      </header>

      <section className="border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50/90">
        <div className="mx-auto max-w-[1600px] px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-10 lg:pb-20 lg:pt-14 xl:px-14">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.26em] text-blue-600">
            Product range
          </p>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl lg:leading-[1.08]">
                {category.name}
              </h1>
              <div className="mt-4 h-1 w-16 bg-gradient-to-r from-blue-600 to-indigo-500" />
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Explore benchtop and laboratory equipment in this category. Each
                listing includes imagery, specifications where provided, and
                direct options to request a quote or reach us on WhatsApp.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3 border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-slate-50 text-blue-700">
                <Package className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  In this category
                </p>
                <p className="text-lg font-bold tabular-nums text-slate-900">
                  {count}{" "}
                  <span className="text-sm font-semibold text-slate-600">
                    {count === 1 ? "product" : "products"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-14">
          {count === 0 ? (
            <div className="border border-slate-200 bg-white px-8 py-16 text-center sm:py-20">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">
                <Package className="h-8 w-8" strokeWidth={1.25} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                No products yet
              </h2>
              <p className="mx-auto mt-3 max-w-md text-slate-600">
                We haven&apos;t published equipment in this category. Check
                back soon or contact us for availability.
              </p>
              <Link
                href="/contact-us"
                className="mt-8 inline-flex items-center gap-2 border border-blue-600 bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Contact us
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    All listings
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Select a product for full details, specifications table, and
                    quote options.
                  </p>
                </div>
                <Link
                  href="/contact-us"
                  className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Can&apos;t find what you need?
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <ul className="grid gap-px border border-slate-300 bg-slate-300 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <li key={String(p._id)} className="min-w-0 bg-white">
                    <Link
                      href={`/products/${categorySlug}/${p.slug}`}
                      className="group flex h-full flex-col outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                    >
                      <div className="relative aspect-[5/4] bg-slate-100">
                        {p.images ? (
                          <Image
                            src={p.images}
                            alt={p.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-contain p-4 transition duration-300 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-medium text-slate-400">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between border-t border-slate-200 bg-white p-4 sm:p-5">
                        <div>
                          <h3 className="text-sm font-semibold leading-snug text-slate-900 sm:text-base">
                            {p.name}
                          </h3>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-600 transition group-hover:gap-2">
                          View product
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 py-14 text-white sm:py-16">
        <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-8 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-10 xl:px-14">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Browsing for a lab build or upgrade?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-blue-100 sm:text-base">
              Tell us your application and budget — we&apos;ll help you shortlist
              equipment across categories and follow up with documentation and
              pricing.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 border border-white bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Back to home
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
