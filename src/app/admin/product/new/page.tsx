"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function NewProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    categorySlug: "",
    price: "",
    images: "",
    shortDescription: "",
    description: ""
  });

  // Fetch categories
  useEffect(() => {
    axios.get("/api/category/getCategory").then((res) => setCategories(res.data));
  }, []);

  // Submit form
  const submit = async () => {
    try {
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : undefined,
        images: form.images ? form.images.split(",").map((s) => s.trim()) : []
      };

      await axios.post("/api/products", payload);
      router.push("/admin/product");
    } catch (error: any) {
      console.error("Create product error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to create product");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Add Product</h1>

      <div className="grid gap-3 max-w-2xl">
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />

        {/* Category by slug */}
        <select
          className="border p-2 rounded"
          value={form.categorySlug}
          onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Images (comma-separated URLs)"
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
        />
        <textarea
          className="border p-2 rounded"
          placeholder="Short Description"
          value={form.shortDescription}
          onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
        />
        <textarea
          className="border p-2 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-fit"
          onClick={submit}
        >
          Create
        </button>
      </div>
    </div>
  );
}