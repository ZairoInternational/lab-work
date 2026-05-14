"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

type ContactInfo = {
  address: string;
  phone1: string;
  phone2: string;
};

export default function AdminContactInfoPage() {
  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null), []);

  const [form, setForm] = useState<ContactInfo>({ address: "", phone1: "", phone2: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setIsLoading(false);
        setError("Not logged in.");
        return;
      }

      try {
        setError("");
        const res = await axios.get("/api/admin/contact-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data?.data ?? { address: "", phone1: "", phone2: "" });
      } catch (e) {
        setError("Failed to load contact info.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [token]);

  const onChange = (key: keyof ContactInfo, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setSuccess("");
  };

  const onSave = async () => {
    if (!token) return;
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await axios.put("/api/admin/contact-info", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Saved.");
    } catch (e) {
      setError("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900">Contact Info</h1>
        <p className="text-gray-600 mt-2">
          Update the address and phone numbers shown in the website top bar.
        </p>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mt-6 space-y-5">
          {isLoading ? (
            <div className="text-gray-600">Loading…</div>
          ) : (
            <>
              {error ? <div className="text-sm text-red-600">{error}</div> : null}
              {success ? <div className="text-sm text-green-700">{success}</div> : null}

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Address</label>
                <input
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Phone number 1</label>
                  <input
                    value={form.phone1}
                    onChange={(e) => onChange("phone1", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="+91 …"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Phone number 2</label>
                  <input
                    value={form.phone2}
                    onChange={(e) => onChange("phone2", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="+91 …"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onSave}
                  disabled={isSaving || isLoading || !!error}
                  className="px-5 py-3 rounded-xl bg-blue-500 text-white font-medium disabled:opacity-60"
                >
                  {isSaving ? "Saving…" : "Save"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

