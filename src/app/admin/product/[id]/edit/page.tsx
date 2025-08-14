"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import { useParams, useRouter } from "next/navigation";

interface Category {
    _id: string;
    name: string;
    slug: string;
}
interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string | Category; // If populated, it'll be Category object
  price?: number;
  images: string[];
  shortDescription?: string;
  description?: string;
  specs?: Record<string, string | number>;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const [cats, prod] = await Promise.all([
        axios.get("/api/category"),
        axios.get(`/api/product/${id}`)
      ]);
      setCategories(cats.data);
      const p: Product = prod.data;
      setForm({
        name: p.name,
        slug: p.slug,
        category: typeof p.category === "string" ? p.category : (p.category as any)._id,
        price: p.price ?? "",
        images: (p.images || []).join(", "),
        shortDescription: p.shortDescription ?? "",
        description: p.description ?? ""
      });
    })();
  }, [id]);

  const save = async () => {
    const payload = {
      ...form,
      price: form.price ? Number(form.price) : undefined,
      images: form.images ? form.images.split(",").map((s: string)=>s.trim()) : []
    };
    await axios.put(`/api/product/${id}`, payload);
    router.push("/admin/products");
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Edit Product</h1>

      <div className="grid gap-3 max-w-2xl">
        <input className="border p-2 rounded" value={form.name}
               onChange={e=>setForm({...form, name: e.target.value})}/>
        <input className="border p-2 rounded" value={form.slug}
               onChange={e=>setForm({...form, slug: e.target.value})}/>
        <select className="border p-2 rounded" value={form.category}
                onChange={e=>setForm({...form, category: e.target.value})}>
          <option value="">Select category</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input className="border p-2 rounded" type="number" value={form.price}
               onChange={e=>setForm({...form, price: e.target.value})}/>
        <input className="border p-2 rounded" value={form.images}
               onChange={e=>setForm({...form, images: e.target.value})}/>
        <textarea className="border p-2 rounded" value={form.shortDescription}
               onChange={e=>setForm({...form, shortDescription: e.target.value})}/>
        <textarea className="border p-2 rounded" value={form.description}
               onChange={e=>setForm({...form, description: e.target.value})}/>
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-fit" onClick={save}>Save</button>
      </div>
    </div>
  );
}
