"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
  price?: number;
  images: string;
  pdf?: string;
  shortDescription?: string;
  description?: string;
}

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Product>({
    _id: "",
    name: "",
    slug: "",
    category: "",
    price: 0,
    images: "",
    pdf: "",
    shortDescription: "",
    description: "",
  });

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
          price: product.price ?? 0,
          images: product.images || "",
          pdf: product.pdf || "",
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
        });
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

      const res = await axios.post("/api/uploadPdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : undefined,
        images: form.images ? form.images : "",
        pdf: form.pdf ? form.pdf : "",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/admin" className="hover:text-blue-400 transition-colors">
            Admin
          </Link>
          <span>/</span>
          <Link
            href="/admin/product"
            className="hover:text-blue-400 transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900">Edit Product</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">Update product information</p>
          </div>
          <Link
            href="/admin/product"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Products
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="grid gap-6 max-w-2xl">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Slug *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="product-slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of the name
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white"
                    value={
                      form.category
                        ? typeof form.category === "string"
                          ? form.category
                          : (form.category as Category)._id
                        : ""
                    }
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Photos Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Image
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Product Image
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      disabled={isUploadingImage}
                    />
                    {isUploadingImage && (
                      <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        Uploading image...
                      </p>
                    )}
                  </div>
                  {form.images && (
                    <div className="relative">
                      <img
                        src={form.images}
                        alt="Product Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, images: "" })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PDF Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Description PDF
              </h3>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  PDF
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Product Description PDF
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePdfUpload(file);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                  {form.pdf && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mt-3">
                      <svg
                        className="w-8 h-8 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          PDF Uploaded
                        </p>
                        <a
                          href={form.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View PDF
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, pdf: "" })}
                        className="text-red-500 hover:text-red-700 font-medium text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Description
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                placeholder="Brief description for product listings"
                rows={3}
                value={form.shortDescription}
                onChange={(e) =>
                  setForm({ ...form, shortDescription: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                placeholder="Detailed product description"
                rows={6}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <button
              className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={save}
              disabled={isSaving || isUploadingImage || isUploadingPdf}
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
            <Link
              href="/admin/product"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
