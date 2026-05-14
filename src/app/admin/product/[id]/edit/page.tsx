"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  ImageIcon,
  Loader2,
  Package,
  Save,
  FileText,
  LayoutList,
  Sparkles,
} from "lucide-react";
import { AdminProductDescriptionMediaPreview } from "@/src/components/admin-product-description-media-preview";
import { descriptionMediaUploadEndpoint } from "@/src/lib/mediaUrl";
import { AdminSpecTableEditor } from "@/src/components/admin-spec-table-editor";
import {
  parseSpecTableBundle,
  defaultSpecTableMeta,
  type SpecTableMeta,
} from "@/src/lib/specTable";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id?: string;
  name: string;
  slug: string;
  category: string | Category;
  images: string;
  pdf?: string;
  shortDescription?: string;
  description?: string;
  featured?: boolean;
  specs?: unknown;
}

function SectionShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">{title}</h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [specTable, setSpecTable] = useState<string[][] | null>(null);
  const [specTableMeta, setSpecTableMeta] = useState<SpecTableMeta>(() => defaultSpecTableMeta());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Product>({
    _id: "",
    name: "",
    slug: "",
    category: "",
    images: "",
    pdf: "",
    shortDescription: "",
    description: "",
    featured: false,
  });

  const categorySlug = useMemo(
    () => categories.find((c) => c._id === form.category)?.slug ?? "",
    [categories, form.category]
  );
  const categoryLabel = useMemo(
    () => categories.find((c) => c._id === form.category)?.name ?? "—",
    [categories, form.category]
  );
  const liveProductHref =
    categorySlug && form.slug?.trim() ? `/products/${categorySlug}/${form.slug.trim()}` : null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/category/getCategory");
        setCategories(res.data as Category[]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`/api/products/${id}`);
        const product: Product = res.data;
        setForm({
          name: product.name,
          slug: product.slug,
          category:
            typeof product.category === "string"
              ? product.category
              : (product.category as Category)._id,
          images: product.images || "",
          pdf: product.pdf || "",
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          featured: Boolean(product.featured),
        });
        const bundle = parseSpecTableBundle(product.specs);
        setSpecTable(bundle.rows);
        setSpecTableMeta(
          bundle.rows && bundle.rows.length > 0 ? bundle.meta : defaultSpecTableMeta()
        );
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      await fetchCategories();
      await fetchProduct();
      setIsLoading(false);
    };

    loadData();
  }, [id]);

  const handleFileUpload = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.url) {
        setForm((prev) => ({ ...prev, images: res.data.url }));
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePdfUpload = async (file: File) => {
    setIsUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(descriptionMediaUploadEndpoint(file), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.url) {
        setForm((prev) => ({ ...prev, pdf: res.data.url }));
      } else {
        alert("PDF upload failed");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("PDF upload failed");
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.slug.trim()) newErrors.slug = "Product slug is required";
    if (!form.category) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validateForm()) return;
    setIsSaving(true);
    try {
      const { _id, ...rest } = form;
      const payload = {
        ...rest,
        images: form.images ? form.images : "",
        pdf: form.pdf ? form.pdf : "",
        featured: Boolean(form.featured),
        specs:
          specTable && specTable.length > 0 ? { specTable, specTableMeta } : {},
      };
      await axios.put(`/api/products/${id}`, payload);
      router.push("/admin/product");
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-600">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="mt-4 text-sm font-medium">Loading product…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-90" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(59,130,246,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.06),transparent_42%)]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/admin/product"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              All products
            </Link>
            <nav className="hidden text-xs font-medium text-slate-500 sm:flex sm:items-center sm:gap-1.5">
              <Link href="/admin" className="hover:text-blue-600">
                Admin
              </Link>
              <ChevronRight className="h-3 w-3 opacity-50" />
              <Link href="/admin/product" className="hover:text-blue-600">
                Products
              </Link>
              <ChevronRight className="h-3 w-3 opacity-50" />
              <span className="truncate text-slate-800">{form.name || "Edit product"}</span>
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {liveProductHref ? (
              <Link
                href={liveProductHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
              >
                View live
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            ) : null}
            <button
              type="button"
              onClick={save}
              disabled={isSaving || isUploadingImage || isUploadingPdf}
              className="inline-flex items-center justify-center gap-2 border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" strokeWidth={2.25} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mb-8 border border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 p-6 shadow-sm sm:p-8 lg:p-10">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-blue-600">Edit listing</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {form.name || "Untitled product"}
          </h1>
          <div className="mt-4 h-1 w-14 bg-gradient-to-r from-blue-600 to-indigo-500" />
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Update imagery, description sheet, specification table, and copy. Changes apply to the public product page
            after you save.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-12 xl:items-start">
          <div className="space-y-8 xl:col-span-8">
            <SectionShell eyebrow="Identity" title="Basics & visibility">
              <div className="grid max-w-2xl gap-5">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Product name *
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Trinocular microscope"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name ? <p className="mt-1.5 text-sm text-red-600">{errors.name}</p> : null}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    URL slug *
                  </label>
                  <input
                    type="text"
                    className={`${inputClass} font-mono text-sm`}
                    placeholder="product-url-slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                  {errors.slug ? <p className="mt-1.5 text-sm text-red-600">{errors.slug}</p> : null}
                  <p className="mt-1.5 text-xs text-slate-500">Used in the public URL: /products/category-slug/…</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category *
                  </label>
                  <select
                    className={inputClass}
                    value={
                      form.category
                        ? typeof form.category === "string"
                          ? form.category
                          : (form.category as Category)._id
                        : ""
                    }
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category ? (
                    <p className="mt-1.5 text-sm text-red-600">{errors.category}</p>
                  ) : null}
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                  <input
                    id="featured-edit"
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={Boolean(form.featured)}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  <label htmlFor="featured-edit" className="cursor-pointer text-sm text-slate-700">
                    <span className="flex items-center gap-2 font-semibold text-slate-900">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Featured on homepage
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Show in the Laboratory Solutions section on the home page.
                    </span>
                  </label>
                </div>
              </div>
            </SectionShell>

            <SectionShell eyebrow="Media" title="Product image">
              <div className="space-y-4">
                <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="w-full border border-dashed border-slate-300 bg-slate-50/50 px-4 py-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-slate-400"
                />
                {isUploadingImage ? (
                  <p className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading…
                  </p>
                ) : null}
                {form.images ? (
                  <div className="relative w-full pt-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, images: "" })}
                      className="absolute right-2 top-4 z-10 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-md transition hover:bg-red-700"
                    >
                      Remove
                    </button>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
                    <div className="aspect-square w-full overflow-hidden border border-slate-200 bg-white shadow-inner">
                      <img
                        src={form.images}
                        alt="Product"
                        className="h-full w-full object-contain p-4 sm:p-8"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </SectionShell>

            <SectionShell eyebrow="Document" title="Product sheet (PDF or image)">
              <p className="mb-4 text-sm text-slate-600">
                Shown like the main product visual on the live page when the file is an image; PDFs open for download on
                the storefront.
              </p>
              <input
                type="file"
                accept="application/pdf,image/*"
                disabled={isUploadingPdf}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePdfUpload(file);
                }}
                className="w-full border border-dashed border-slate-300 bg-slate-50/50 px-4 py-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-slate-400"
              />
              {isUploadingPdf ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </p>
              ) : null}
              {form.pdf ? (
                <div className="mt-4">
                  <AdminProductDescriptionMediaPreview
                    url={form.pdf}
                    onRemove={() => setForm({ ...form, pdf: "" })}
                  />
                </div>
              ) : null}
            </SectionShell>

            <SectionShell eyebrow="Data" title="Specification table">
              <p className="mb-4 text-sm text-slate-600">
                Rows and columns appear in the specifications block on the public product page.
              </p>
              <AdminSpecTableEditor
                value={specTable}
                onChange={(next) => {
                  setSpecTable(next);
                  if (!next) setSpecTableMeta(defaultSpecTableMeta());
                }}
                meta={specTableMeta}
                onMetaChange={setSpecTableMeta}
              />
            </SectionShell>

            <SectionShell eyebrow="Copy" title="Descriptions">
              <div className="grid max-w-2xl gap-5">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Short description
                  </label>
                  <textarea
                    className={`${inputClass} resize-y min-h-[96px]`}
                    placeholder="For listings and cards"
                    rows={3}
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <FileText className="h-3.5 w-3.5" />
                    Full description
                  </label>
                  <textarea
                    className={`${inputClass} resize-y min-h-[160px]`}
                    placeholder="Long-form detail for the product page"
                    rows={6}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
            </SectionShell>

            <div className="flex flex-wrap items-center gap-3 border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <button
                type="button"
                onClick={save}
                disabled={isSaving || isUploadingImage || isUploadingPdf}
                className="inline-flex items-center justify-center gap-2 border border-blue-600 bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" strokeWidth={2.25} />
                    Save changes
                  </>
                )}
              </button>
              <Link
                href="/admin/product"
                className="inline-flex items-center justify-center border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </div>

          <aside className="xl:col-span-4">
            <div className="space-y-6 xl:sticky xl:top-24">
              <div className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-600">Summary</p>
                <div className="mt-4 overflow-hidden border border-slate-200 bg-slate-50">
                  {form.images ? (
                    <img src={form.images} alt="" className="aspect-[4/3] w-full object-contain p-4" />
                  ) : (
                    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400">
                      <Package className="h-10 w-10" strokeWidth={1.25} />
                      <span className="text-xs font-medium">No image</span>
                    </div>
                  )}
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                    <dt className="text-slate-500">Category</dt>
                    <dd className="text-right font-medium text-slate-900">{categoryLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                    <dt className="text-slate-500">Slug</dt>
                    <dd className="max-w-[60%] truncate font-mono text-xs text-slate-800">{form.slug || "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Featured</dt>
                    <dd className="font-medium text-slate-900">{form.featured ? "Yes" : "No"}</dd>
                  </div>
                </dl>
                {liveProductHref ? (
                  <Link
                    href={liveProductHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex w-full items-center justify-center gap-2 border border-slate-200 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50/50"
                  >
                    Open live page
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <p className="mt-4 text-xs text-slate-500">Save a category and slug to preview the public URL.</p>
                )}
              </div>

              <div className="border border-blue-200 bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-sm sm:p-6">
                <div className="flex items-center gap-2 font-semibold">
                  <LayoutList className="h-4 w-4" />
                  Quick checklist
                </div>
                <ul className="mt-3 space-y-2 text-sm text-blue-100">
                  <li className="flex gap-2">
                    <span className="text-blue-200">—</span>
                    Clear product image for catalogue & PDP
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-200">—</span>
                    Sheet or PDF for downloads / hero media
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-200">—</span>
                    Spec table for technical buyers
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
