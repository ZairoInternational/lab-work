"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

type SocialLinks = {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  github: string;
};

const initial: SocialLinks = {
  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: "",
  youtube: "",
  github: "",
};

const fields: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/your-page" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/your-profile" },
  { key: "twitter", label: "X (Twitter)", placeholder: "https://x.com/your-handle" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/…" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@your-channel" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/your-org" },
];

export default function AdminSocialLinksPage() {
  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null), []);
  const [form, setForm] = useState<SocialLinks>(initial);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setIsLoading(false);
        setError("Not logged in.");
        return;
      }
      try {
        setError("");
        const res = await axios.get("/api/admin/social-links", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({ ...initial, ...(res.data?.data ?? {}) });
      } catch {
        setError("Failed to load social links.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [token]);

  const onChange = (key: keyof SocialLinks, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setSuccess("");
  };

  const onSave = async () => {
    if (!token) return;
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await axios.put("/api/admin/social-links", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Saved. Only filled links appear in the site footer.");
    } catch {
      setError("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900">Social links</h1>
        <p className="text-gray-600 mt-2">
          Add full URLs for the networks you use. Leave a field empty to hide that icon in the footer.
        </p>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mt-6 space-y-5">
          {isLoading ? (
            <div className="text-gray-600">Loading…</div>
          ) : (
            <>
              {error ? <div className="text-sm text-red-600">{error}</div> : null}
              {success ? <div className="text-sm text-green-700">{success}</div> : null}

              <div className="grid gap-4">
                {fields.map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
                    <input
                      type="url"
                      value={form[key]}
                      onChange={(e) => onChange(key, e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder={placeholder}
                      autoComplete="off"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
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
