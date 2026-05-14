"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";

type Review = {
  _id: string;
  name: string;
  rating: number;
  photo: string;
  body: string;
  order?: number;
};

function StarsInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`rounded-md p-1 transition ${
            n <= value ? "text-amber-400" : "text-gray-300 hover:text-amber-200"
          }`}
          aria-pressed={n <= value}
          aria-label={`${n} stars`}
        >
          <svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">{value} / 5</span>
    </div>
  );
}

function StarsRead({ rating }: { rating: number }) {
  const r = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`h-4 w-4 ${n <= r ? "text-amber-400" : "text-gray-200"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null), []);
  const [items, setItems] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [rating, setRating] = useState(5);
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
      const res = await axios.get("/api/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data?.data ?? []);
    } catch {
      setError("Failed to load reviews.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const resetForm = () => {
    setName("");
    setBody("");
    setPhotoUrl("");
    setRating(5);
    setEditingId(null);
  };

  const startEdit = (r: Review) => {
    setEditingId(r._id);
    setName(r.name);
    setBody(r.body);
    setPhotoUrl(r.photo);
    setRating(r.rating);
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
        setSuccess("Photo uploaded. Save the review when ready.");
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
    const n = name.trim();
    const photo = photoUrl.trim();
    const text = body.trim();
    if (!n || !photo || !text) {
      setError("Name, photo, and review text are required.");
      return;
    }
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await axios.put(
          `/api/admin/reviews/${editingId}`,
          { name: n, photo, body: text, rating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Review updated.");
      } else {
        await axios.post(
          "/api/admin/reviews",
          { name: n, photo, body: text, rating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Review added.");
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
    if (!token || !confirm("Delete this review?")) return;
    try {
      await axios.delete(`/api/admin/reviews/${id}`, {
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Voices from the bench</h1>
            <p className="mt-1 text-gray-600">
              Customer stories shown in the{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                home page
              </Link>{" "}
              “Voices from the bench” section. Add name, stars, photo, and the full quote.
            </p>
          </div>
        </div>

        <div className="mb-8 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingId ? "Edit review" : "Add review"}
          </h2>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-green-700">{success}</p> : null}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">Name</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSuccess("");
              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g. Dr. Meera Iyer"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">Star rating</label>
            <StarsInput value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">Photo (headshot or logo)</label>
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
            {isUploading ? <p className="mt-2 text-sm text-blue-600">Uploading…</p> : null}
            {photoUrl ? (
              <div className="mt-3 flex items-start gap-4">
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="h-24 w-24 rounded-full border border-gray-200 object-cover"
                />
                <button type="button" onClick={() => setPhotoUrl("")} className="text-sm text-red-600 hover:underline">
                  Clear photo
                </button>
              </div>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">Review</label>
            <textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setSuccess("");
              }}
              rows={5}
              className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="What they appreciated, how delivery or support went, outcome in the lab…"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={save}
              disabled={isSaving || isLoading || !token}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Saving…" : editingId ? "Update review" : "Save review"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setSuccess("");
                  setError("");
                }}
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Published reviews ({items.length})</h2>
          </div>
          {isLoading ? (
            <p className="p-6 text-gray-600">Loading…</p>
          ) : items.length === 0 ? (
            <p className="p-6 text-gray-600">No reviews yet. Add one above.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((r) => (
                <li key={r._id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
                  <img
                    src={r.photo}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-full border border-gray-200 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900">{r.name}</span>
                      <StarsRead rating={r.rating} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{r.body}</p>
                  </div>
                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    <button
                      type="button"
                      onClick={() => startEdit(r)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(r._id)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
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
