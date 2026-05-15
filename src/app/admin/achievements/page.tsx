"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";

type Achievement = {
  _id: string;
  title: string;
  description: string;
  photo: string;
  order?: number;
};

export default function AdminAchievementsPage() {
  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null), []);
  const [items, setItems] = useState<Achievement[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    if (!token) {
      setIsLoading(false);
      setError("Not logged in.");
      return;
    }
    try {
      setError("");
      const res = await axios.get("/api/admin/achievements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data?.data ?? []);
    } catch {
      setError("Failed to load achievements.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPhotoUrl("");
    setEditingId(null);
  };

  const startEdit = (a: Achievement) => {
    setEditingId(a._id);
    setTitle(a.title);
    setDescription(a.description);
    setPhotoUrl(a.photo);
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await axios.post("/api/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        setPhotoUrl(res.data.url);
        setSuccess("Photo uploaded.");
      } else {
        setError("Upload failed.");
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const save = async () => {
    if (!token) return;
    const t = title.trim();
    const d = description.trim();
    const p = photoUrl.trim();
    if (!t || !d || !p) {
      setError("Title, description, and photo are required.");
      return;
    }
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await axios.put(
          `/api/admin/achievements/${editingId}`,
          { title: t, description: d, photo: p },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Achievement updated.");
      } else {
        await axios.post(
          "/api/admin/achievements",
          { title: t, description: d, photo: p },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Achievement added.");
      }
      resetForm();
      await load();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message || "Failed to save.");
      } else {
        setError("Failed to save.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!token || !confirm("Delete this achievement?")) return;
    try {
      await axios.delete(`/api/admin/achievements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (editingId === id) resetForm();
      await load();
      setSuccess("Deleted.");
    } catch {
      setError("Failed to delete.");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          <p className="text-gray-600 mt-1">
            Add milestones with a title, description, and photo. They appear on the public{" "}
            <Link href="/achievements" className="text-blue-600 hover:underline">
              Achievements
            </Link>{" "}
            page.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingId ? "Edit achievement" : "Add achievement"}
          </h2>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-green-700">{success}</p> : null}

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSuccess("");
              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g. ISO certification milestone"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setSuccess("");
              }}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-y"
              placeholder="Tell the story behind this achievement…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Photo</label>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f);
                e.target.value = "";
              }}
              className="w-full text-sm text-gray-600"
            />
            {isUploading ? <p className="text-sm text-blue-600 mt-2">Uploading…</p> : null}
            {photoUrl ? (
              <div className="mt-3 flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="h-28 w-28 rounded-xl border border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl("")}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear photo
                </button>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={save}
              disabled={isSaving || isLoading || !token}
              className="px-5 py-3 rounded-xl bg-blue-500 text-white font-medium disabled:opacity-60"
            >
              {isSaving ? "Saving…" : editingId ? "Update achievement" : "Save achievement"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Published achievements ({items.length})
            </h2>
          </div>
          {isLoading ? (
            <div className="p-8 text-gray-600">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-gray-500 text-center">No achievements yet. Add one above.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((a) => (
                <li key={a._id} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 hover:bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.photo}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-xl border border-gray-100 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{a.title}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.description}</p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(a)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(a._id)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
