"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";

type Certificate = {
  _id: string;
  name: string;
  image: string;
  order?: number;
};

export default function AdminCertificatesPage() {
  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null), []);
  const [items, setItems] = useState<Certificate[]>([]);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
      const res = await axios.get("/api/admin/certificates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data?.data ?? []);
    } catch {
      setError("Failed to load certificates.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

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
        setImageUrl(res.data.url);
        setSuccess("Image uploaded. Add a name and click Save certificate.");
      } else {
        setError("Upload failed.");
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const addCertificate = async () => {
    if (!token) return;
    const n = name.trim();
    const img = imageUrl.trim();
    if (!n || !img) {
      setError("Certificate name and image are required.");
      return;
    }
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(
        "/api/admin/certificates",
        { name: n, image: img },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setImageUrl("");
      setSuccess("Certificate added.");
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
    if (!token || !confirm("Delete this certificate?")) return;
    try {
      await axios.delete(`/api/admin/certificates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await load();
      setSuccess("Deleted.");
    } catch {
      setError("Failed to delete.");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
            <p className="text-gray-600 mt-1">
              Upload certificate images and set names. They appear on the public{" "}
              <Link href="/certificates" className="text-blue-600 hover:underline">
                Certifications
              </Link>{" "}
              page.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Add certificate</h2>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-green-700">{success}</p> : null}

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Certificate name</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSuccess("");
              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g. ISO 9001:2015"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Certificate image</label>
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
            {imageUrl ? (
              <div className="mt-3 flex items-start gap-4">
                <img src={imageUrl} alt="Preview" className="h-32 w-auto rounded-lg border border-gray-200 object-contain" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear image
                </button>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={addCertificate}
            disabled={isSaving || isLoading || !token}
            className="px-5 py-3 rounded-xl bg-blue-500 text-white font-medium disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save certificate"}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Published certificates ({items.length})</h2>
          </div>
          {isLoading ? (
            <div className="p-8 text-gray-600">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-gray-500 text-center">No certificates yet. Add one above.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((c) => (
                <li key={c._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-gray-50">
                  <img
                    src={c.image}
                    alt=""
                    className="h-20 w-auto max-w-[120px] object-contain rounded border border-gray-100 bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">{c.image}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(c._id)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium self-start sm:self-center"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
