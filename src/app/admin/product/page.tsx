"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";


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

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");

  const load = async () => {
    const res = await axios.get("/api/products", { params: { q } });
    setProducts(res.data);
  };

  const del = async (id: string) => {
    await axios.delete(`/api/product/${id}`);
    load();
  };

  useEffect(() => { load(); }, []); // initial load

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link href="/admin/product/new" className="px-3 py-2 bg-blue-600 text-white rounded">Add Product</Link>
      </div>

      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="border p-2 rounded"/>
        <button onClick={load} className="px-3 py-2 bg-gray-200 rounded">Search</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Slug</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2 text-gray-500">{p.slug}</td>
                <td className="p-2">{typeof p.price === "number" ? `₹${p.price}` : "-"}</td>
                <td className="p-2 space-x-2">
                  <Link className="px-2 py-1 bg-gray-200 rounded" href={`/admin/products/${p._id}/edit`}>Edit</Link>
                  <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={()=>del(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td className="p-4 text-gray-500" colSpan={4}>No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
