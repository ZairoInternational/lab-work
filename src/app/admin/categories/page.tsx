"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);

  const load = async () => {
    const res = await axios.get("/api/category");
    setCategories(res.data);
  };

  const add = async () => {
    if (!name || !slug) return;
    await axios.post("/api/category/addCategory", { name, slug });
    setName(""); setSlug("");
    load();
  };

  const del = async (id: string) => {
    await axios.delete(`/api/category/${id}`);
    load();
  };

  const saveEdit = async () => {
    if (!editing) return;
    await axios.put(`/api/category/${editing._id}`, { name: editing.name, slug: editing.slug });
    setEditing(null);
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Categories</h1>

      <div className="flex gap-2 mb-4">
        <input className="border p-2 rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Slug" value={slug} onChange={e=>setSlug(e.target.value)} />
        <button className="bg-blue-600 text-white px-3 rounded" onClick={add}>Add</button>
      </div>

      <ul className="divide-y">
        {categories.map(c => (
          <li key={c._id} className="py-3 flex items-center gap-3">
            {editing?._id === c._id ? (
              <>
                <input className="border p-1 rounded" value={editing.name}
                       onChange={e=>setEditing({...editing, name: e.target.value})}/>
                <input className="border p-1 rounded" value={editing.slug}
                       onChange={e=>setEditing({...editing, slug: e.target.value})}/>
                <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={saveEdit}>Save</button>
                <button className="px-2 py-1 bg-gray-300 rounded" onClick={()=>setEditing(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span className="min-w-48">{c.name}</span>
                <span className="text-gray-500">{c.slug}</span>
                <div className="ml-auto flex gap-2">
                  <button className="px-2 py-1 bg-gray-200 rounded" onClick={()=>setEditing(c)}>Edit</button>
                  <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={()=>del(c._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
