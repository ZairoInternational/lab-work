"use client";

import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { Download, ShoppingBag, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { isLikelyImageUrl } from "@/src/lib/mediaUrl";

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
  pdf?: string;
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

type LeadForm = {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  productName: string;
  note: string;
};

const WHATSAPP_E164 = "919956499800";

function productPageUrl(product: Product): string {
  const catSlug =
    typeof product.category === "object" && product.category
      ? product.category.slug
      : "";
  const origin =
    (typeof window !== "undefined" && window.location.origin) ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "";
  if (!origin || !catSlug) return "";
  return `${origin.replace(/\/$/, "")}/products/${catSlug}/${product.slug}`;
}

function downloadFilename(product: Product): string {
  const base =
    product.name
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "product-sheet";
  const url = product.pdf || "";
  if (isLikelyImageUrl(url)) {
    const m = url.split("?")[0].match(/\.(jpe?g|png|gif|webp|svg)$/i);
    return `${base}.${m ? m[1].toLowerCase() : "png"}`;
  }
  return `${base}.pdf`;
}

async function downloadProductAsset(url: string, filename: string) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export default function CheckoutButton({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState<LeadForm>({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    productName: product.name,
    note: "",
  });

  const productUrl = useMemo(() => productPageUrl(product), [product]);

  const whatsappMessage = useMemo(() => {
    const parts = [
      `Hello — I'm interested in this product on your website:`,
      `• ${product.name}`,
      productUrl ? `• Page: ${productUrl}` : "",
      "",
      "Please share more details.",
    ].filter(Boolean);
    return parts.join("\n");
  }, [product.name, productUrl]);

  const whatsappHref = `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(whatsappMessage)}`;

  const openModal = () => {
    setFormError(null);
    setSubmitSuccess(false);
    setForm((prev) => ({
      ...prev,
      productName: product.name,
    }));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSubmitSuccess(false);
    setFormError(null);
  };

  const onField = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((p) => ({ ...p, [name]: value }));
      setFormError(null);
    },
    []
  );

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await axios.post("/api/contact-lead", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        companyName: form.companyName.trim(),
        productName: form.productName.trim() || product.name,
        note: form.note.trim(),
      });
      if (res.data?.success) {
        setSubmitSuccess(true);
      } else {
        setFormError(res.data?.message || "Could not save your enquiry.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.message || "Could not save your enquiry.");
      } else {
        setFormError("Could not save your enquiry.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const hasPdf = Boolean(product.pdf?.trim());

  const segmentClass =
    "relative flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold tracking-tight transition sm:min-h-[3.5rem] sm:px-5 sm:text-[0.9375rem]";

  return (
    <>
      <div className="overflow-hidden border border-slate-300 bg-white shadow-[0_1px_0_rgba(15,23,42,0.06)] sm:flex sm:flex-row sm:divide-x sm:divide-slate-300">
        <button
          type="button"
          onClick={openModal}
          className={`${segmentClass} w-full border-b border-slate-300 bg-blue-600 text-white last:border-b-0 hover:bg-blue-700 sm:w-auto sm:border-b-0`}
        >
          <ShoppingBag className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
          Get quote
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${segmentClass} w-full border-b border-slate-300 bg-[#25D366] text-white last:border-b-0 hover:bg-[#20bd5a] sm:w-auto sm:border-b-0`}
        >
          <FaWhatsapp className="h-5 w-5 shrink-0" aria-hidden />
          WhatsApp
        </a>

        {hasPdf ? (
          <button
            type="button"
            onClick={() =>
              product.pdf &&
              downloadProductAsset(product.pdf, downloadFilename(product))
            }
            className={`${segmentClass} w-full bg-slate-50 text-slate-900 hover:bg-slate-100 sm:w-auto`}
          >
            <Download className="h-4 w-4 shrink-0 text-slate-700" aria-hidden />
            Download
          </button>
        ) : null}
      </div>

      {modalOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-modal-title"
        >
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 sm:p-8">
              <h2 id="quote-modal-title" className="pr-10 text-xl font-bold text-gray-900 sm:text-2xl">
                {submitSuccess ? "Enquiry received" : "Request a quote"}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {submitSuccess
                  ? "Thank you — your enquiry was saved. Our team can see it in the leads dashboard."
                  : "Same details as our contact form — your enquiry is saved for our team (Leads dashboard)."}
              </p>

              {!submitSuccess ? (
                <form onSubmit={submitLead} className="mt-6 space-y-4">
                  {formError ? (
                    <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{formError}</div>
                  ) : null}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={onField}
                      required
                      autoComplete="name"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={onField}
                        required
                        autoComplete="tel"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onField}
                        required
                        autoComplete="email"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Company name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="companyName"
                      value={form.companyName}
                      onChange={onField}
                      required
                      autoComplete="organization"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Product name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="productName"
                      value={form.productName}
                      onChange={onField}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Note</label>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={onField}
                      rows={3}
                      className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="Quantity, timeline, or other details (optional)"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {submitting ? "Saving…" : "Submit enquiry"}
                  </button>
                </form>
              ) : (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
