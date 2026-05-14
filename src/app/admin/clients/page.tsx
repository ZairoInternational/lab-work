"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";

type SiteClient = {
  _id: string;
  name: string;
  logo: string;
  order?: number;
};

export default function AdminClientsPage() {
  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null), []);
  const [items, setItems] = useState<SiteClient[]>([]);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
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
      const res = await axios.get("/api/admin/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data?.data ?? []);
    } catch {
      setError("Failed to load clients.");
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
        setLogoUrl(res.data.url);
        setSuccess("Logo uploaded. Confirm the name and click Save client.");
      } else {
        setError("Upload failed.");
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const addClient = async () => {
    if (!token) return;
    const n = name.trim();
    const logo = logoUrl.trim();
    if (!n || !logo) {
      setError("Client name and logo are required.");
      return;
    }
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(
        "/api/admin/clients",
        { name: n, logo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setLogoUrl("");
      setSuccess("Client added.");
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

  const importDefaults = async () => {
    if (!token) return;
    setIsImporting(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        "/api/admin/clients",
        { importDefaults: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const added = res.data?.data?.added ?? 0;
      setSuccess(added ? `Imported ${added} new client(s). Skips logos already in the list.` : "No new defaults to import (all already present).");
      await load();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message || "Import failed.");
      } else {
        setError("Import failed.");
      }
    } finally {
      setIsImporting(false);
    }
  };

  const remove = async (id: string) => {
    if (!token || !confirm("Remove this client from the public list?")) return;
    try {
      await axios.delete(`/api/admin/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await load();
      setSuccess("Removed.");
    } catch {
      setError("Failed to delete.");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">
              Each entry is a <strong>name</strong> and <strong>logo</strong> only. They appear on the{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                home page
              </Link>{" "}
              partner ribbon and on{" "}
              <Link href="/about-us#clients" className="text-blue-600 hover:underline">
                About us → Clients
              </Link>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={importDefaults}
            disabled={isImporting || isLoading || !token}
            className="shrink-0 px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-blue-700 font-medium text-sm hover:bg-blue-50 disabled:opacity-60"
          >
            {isImporting ? "Importing…" : "Import default partners"}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Add client</h2>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-green-700">{success}</p> : null}

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Client / organization name</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSuccess("");
              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g. Indian Institute Of Technology Kanpur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Logo</label>
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
            {logoUrl ? (
              <div className="mt-3 flex items-start gap-4">
                <img src={logoUrl} alt="Preview" className="h-24 w-auto max-w-[200px] rounded-lg border border-gray-200 object-contain bg-gray-50" />
                <button type="button" onClick={() => setLogoUrl("")} className="text-sm text-red-600 hover:underline">
                  Clear logo
                </button>
              </div>
            ) : null}
            <p className="text-xs text-gray-500 mt-2">Or paste a public image URL after uploading elsewhere.</p>
            <input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="https://…"
            />
          </div>

          <button
            type="button"
            onClick={addClient}
            disabled={isSaving || isLoading || !token}
            className="px-5 py-3 rounded-xl bg-blue-500 text-white font-medium disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save client"}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Published clients ({items.length})</h2>
          </div>
          {isLoading ? (
            <div className="p-8 text-gray-600">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-gray-500 text-center">
              No clients in the database yet. The site still shows the built-in default list until you add rows here or
              use <strong>Import default partners</strong>.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((c) => (
                <li key={c._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-gray-50">
                  <img
                    src={c.logo}
                    alt=""
                    className="h-16 w-16 shrink-0 object-contain rounded-lg border border-gray-100 bg-gray-50 p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">{c.logo}</p>
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
