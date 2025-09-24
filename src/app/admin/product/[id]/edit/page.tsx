"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"

interface Category {
  _id: string
  name: string
  slug: string
}

interface Product {
  _id?: string
  name: string
  slug: string
  category: string | Category
  price?: number
  images: string
  shortDescription?: string
  description?: string
}

export default function EditProduct() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState<Product>({
    _id: "",
    name: "",
    slug: "",
    category: "",
    price: 0,
    images: "",
    shortDescription: "",
    description: "",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/category/getCategory")
        setCategories(res.data as Category[])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    const fetchProduct = async () => {
      if (!id) return
      try {
        const res = await axios.get(`/api/products/${id}`)
        const product: Product = res.data
        setForm({
          name: product.name,
          slug: product.slug,
          category: typeof product.category === "string" ? product.category : (product.category as Category)._id,
          price: product.price ?? 0,
          images: product.images || "",
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
        })
      } catch (error) {
        console.error("Failed to fetch product:", error)
      }
    }

    const loadData = async () => {
      setIsLoading(true)
      await fetchCategories()
      await fetchProduct()
      setIsLoading(false)
    }

    loadData()
  }, [id])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = "Product name is required"
    if (!form.slug.trim()) newErrors.slug = "Product slug is required"
    if (!form.category) newErrors.category = "Category is required"
    if (!form.price || form.price <= 0) newErrors.price = "Valid price is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const save = async () => {
    if (!validateForm()) return
    setIsSaving(true)
    try {
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : undefined,
        images: form.images ? form.images : "",
      }
      console.log("payload", payload)
      await axios.put(`/api/products/${id}`, payload)
      router.push("/admin/product")
    } catch (error) {
      console.error("Failed to save product:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <p className="p-6 text-gray-600">Loading...</p>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Product Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-md p-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Slug */}
        <div>
          <label className="block mb-1 font-medium">Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full border rounded-md p-2"
          />
          {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category *</label>
          <select
            value={form.category ? (typeof form.category === "string" ? form.category : (form.category as Category)._id) : ""}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price *</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: +e.target.value })}
            className="w-full border rounded-md p-2"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        {/* Images */}
        <div>
          <label className="block mb-1 font-medium">Images (comma separated)</label>
          <input
            type="text"
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block mb-1 font-medium">Short Description</label>
          <textarea
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className="w-full border rounded-md p-2"
            rows={2}
          />
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block mb-1 font-medium">Detailed Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-md p-2"
            rows={4}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={() => router.push("/admin/product")}
          className="px-4 py-2 border rounded-md"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  )
}
