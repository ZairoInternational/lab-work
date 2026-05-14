"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  ChevronRight,
  ExternalLink,
  Layers,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

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
  images?: string;
  featured?: boolean;
  updatedAt?: string;
}

function categoryName(p: Product) {
  if (typeof p.category === "string") return p.category;
  return p.category?.name ?? "—";
}

function categorySlug(p: Product) {
  if (typeof p.category === "object" && p.category?.slug) return p.category.slug;
  return "";
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) => {
      const slug = p.slug?.toLowerCase() ?? "";
      const name = p.name?.toLowerCase() ?? "";
      const cat = categoryName(p).toLowerCase();
      return name.includes(s) || slug.includes(s) || cat.includes(s);
    });
  }, [products, q]);

  const featuredCount = useMemo(
    () => products.filter((p) => p.featured).length,
    [products]
  );

  const del = async (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      await load();
    } catch {
      alert("Failed to delete.");
    }
  };

  const setFeatured = async (id: string, featured: boolean) => {
    try {
      await axios.put(`/api/products/${id}`, { featured });
      await load();
    } catch {
      alert("Failed to update featured flag.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-90" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(59,130,246,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.06),transparent_42%)]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-blue-600">
              Catalogue
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Products
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {loading ? "Loading inventory…" : `${products.length} listings · ${featuredCount} featured on homepage`}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link
              href="/admin/product/new"
              className="inline-flex items-center justify-center gap-2 border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" strokeWidth={2.25} />
              Add product
            </Link>
            <Link
              href="/products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              View storefront
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center border border-slate-200 bg-slate-50 text-blue-600">
                <Package className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total</p>
                <p className="text-2xl font-bold tabular-nums text-slate-900">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center border border-slate-200 bg-slate-50 text-indigo-600">
                <Sparkles className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Featured</p>
                <p className="text-2xl font-bold tabular-nums text-slate-900">{featuredCount}</p>
              </div>
            </div>
          </div>
          <div className="border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600">
                <Layers className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Shown below</p>
                <p className="text-2xl font-bold tabular-nums text-slate-900">{filtered.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, slug, or category…"
                className="w-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <p className="text-xs text-slate-500">
              Tip: featured items appear in the home page Laboratory Solutions section.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-600">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Loading products…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">
                <Package className="h-8 w-8" strokeWidth={1.25} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {products.length === 0 ? "No products yet" : "No matches"}
                </p>
                <p className="mt-1 max-w-sm text-sm text-slate-600">
                  {products.length === 0
                    ? "Create your first product to populate the catalogue and public site."
                    : "Try a different search term."}
                </p>
              </div>
              {products.length === 0 ? (
                <Link
                  href="/admin/product/new"
                  className="mt-2 inline-flex items-center gap-2 border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add product
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3 pl-6 lg:pl-8">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Featured</th>
                    <th className="px-4 py-3 pr-6 text-right lg:pr-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((p) => {
                    const liveSlug = categorySlug(p);
                    const liveHref =
                      liveSlug && p.slug
                        ? `/products/${liveSlug}/${p.slug}`
                        : null;
                    return (
                      <tr
                        key={p._id}
                        className="transition-colors hover:bg-slate-50/80"
                      >
                        <td className="px-4 py-4 pl-6 lg:pl-8">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 shrink-0 overflow-hidden border border-slate-200 bg-slate-100">
                              {p.images ? (
                                <img
                                  src={p.images}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                  <Package className="h-6 w-6" strokeWidth={1.25} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900">{p.name}</p>
                              {p.updatedAt ? (
                                <p className="mt-0.5 text-xs text-slate-500">
                                  Updated {new Date(p.updatedAt).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {categoryName(p)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <code className="rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-700">
                            {p.slug}
                          </code>
                        </td>
                        <td className="px-4 py-4">
                          <label className="inline-flex cursor-pointer select-none items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              checked={Boolean(p.featured)}
                              onChange={(e) => setFeatured(p._id, e.target.checked)}
                            />
                            <span className="text-slate-600">Homepage</span>
                          </label>
                        </td>
                        <td className="px-4 py-4 pr-6 text-right lg:pr-8">
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            {liveHref ? (
                              <Link
                                href={liveHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                              >
                                Live
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            ) : null}
                            <Link
                              href={`/admin/product/${p._id}/edit`}
                              className="inline-flex items-center gap-1 border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 transition hover:bg-blue-100"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => del(p._id)}
                              className="inline-flex items-center gap-1 border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800 transition hover:bg-red-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-10 border border-blue-200 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold sm:text-xl">Need a new listing?</h2>
              <p className="mt-1 max-w-xl text-sm text-blue-100">
                Add products with images, description media, and specification tables—they sync to your public product pages.
              </p>
            </div>
            <Link
              href="/admin/product/new"
              className="inline-flex items-center gap-2 border border-white bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              New product
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
