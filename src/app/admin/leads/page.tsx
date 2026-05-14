"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { LEADS_INBOX_EMAIL } from "@/src/config/leads-mail";

const NOTE_PREVIEW_CHARS = 120;

type Lead = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  companyName: string;
  productName: string;
  note: string;
  read: boolean;
  createdAt: string;
};

function noteExceedsPreview(note: string) {
  return note.trim().length > NOTE_PREVIEW_CHARS;
}

function previewNote(note: string) {
  const t = note.trim();
  if (t.length <= NOTE_PREVIEW_CHARS) return t;
  return `${t.slice(0, NOTE_PREVIEW_CHARS).trimEnd()}…`;
}

export default function AdminLeadsPage() {
  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null), []);
  const [items, setItems] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [noteModalLead, setNoteModalLead] = useState<Lead | null>(null);

  const closeNoteModal = useCallback(() => setNoteModalLead(null), []);

  useEffect(() => {
    if (!noteModalLead) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNoteModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [noteModalLead, closeNoteModal]);

  const load = async () => {
    if (!token) {
      setIsLoading(false);
      setError("Not logged in.");
      return;
    }
    try {
      setError("");
      const res = await axios.get("/api/admin/contact-leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data?.data ?? []);
    } catch {
      setError("Failed to load leads.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const setRead = async (id: string, read: boolean) => {
    if (!token) return;
    try {
      await axios.patch(
        `/api/admin/contact-leads/${id}`,
        { read },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await load();
    } catch {
      setError("Failed to update lead.");
    }
  };

  const remove = async (id: string) => {
    if (!token || !confirm("Delete this lead permanently?")) return;
    try {
      await axios.delete(`/api/admin/contact-leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await load();
    } catch {
      setError("Failed to delete.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {noteModalLead ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
          role="presentation"
          onClick={closeNoteModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-note-dialog-title"
            className="flex max-h-[min(85vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
              <div>
                <h2 id="lead-note-dialog-title" className="text-lg font-semibold text-gray-900">
                  Note
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  {new Date(noteModalLead.createdAt).toLocaleString()} · {noteModalLead.name}
                </p>
              </div>
              <button
                type="button"
                onClick={closeNoteModal}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close"
              >
                <span className="text-xl leading-none" aria-hidden>
                  ×
                </span>
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto px-5 py-4 text-sm">
              <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 text-gray-600">
                <dt className="font-medium text-gray-500">Product</dt>
                <dd className="text-gray-900">{noteModalLead.productName || "—"}</dd>
                <dt className="font-medium text-gray-500">Company</dt>
                <dd className="break-words text-gray-900">{noteModalLead.companyName || "—"}</dd>
                <dt className="font-medium text-gray-500">Email</dt>
                <dd className="break-all text-gray-900">{noteModalLead.email || "—"}</dd>
                <dt className="font-medium text-gray-500">Phone</dt>
                <dd className="text-gray-900">{noteModalLead.phone || "—"}</dd>
              </dl>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Full message</p>
                <p className="mt-2 whitespace-pre-wrap break-words text-base leading-relaxed text-gray-800">
                  {noteModalLead.note.trim() || "—"}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
              <button
                type="button"
                onClick={closeNoteModal}
                className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact leads</h1>
          <p className="mt-1 text-gray-600">
            Enquiries from the public{" "}
            <Link href="/contact-us" className="text-blue-600 hover:underline">
              Contact us
            </Link>{" "}
            form. Each submission is emailed to{" "}
            <span className="font-medium text-gray-800">{LEADS_INBOX_EMAIL}</span> when{" "}
            <code className="rounded bg-gray-100 px-1 text-xs">MAIL_SENDER_EMAIL</code> and{" "}
            <code className="rounded bg-gray-100 px-1 text-xs">MAIL_SENDER_APP_PASSWORD</code> are set in{" "}
            <code className="rounded bg-gray-100 px-1 text-xs">.env.local</code>.
          </p>
        </div>

        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="p-8 text-gray-600">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No leads yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Note</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((l) => (
                    <tr key={l._id} className={l.read ? "bg-white" : "bg-blue-50/40"}>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                        {new Date(l.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{l.name}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">{l.phone}</td>
                      <td className="max-w-[180px] truncate px-4 py-3 text-gray-700">{l.email}</td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-gray-700">{l.companyName}</td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-gray-700">{l.productName}</td>
                      <td className="max-w-[260px] px-4 py-3 align-top text-gray-600">
                        {l.note?.trim() ? (
                          <div className="break-words">
                            <span>{noteExceedsPreview(l.note) ? previewNote(l.note) : l.note.trim()}</span>
                            {noteExceedsPreview(l.note) ? (
                              <>
                                {" "}
                                <button
                                  type="button"
                                  onClick={() => setNoteModalLead(l)}
                                  className="inline text-xs font-semibold text-blue-600 underline decoration-blue-600/30 underline-offset-2 hover:text-blue-700"
                                >
                                  See more
                                </button>
                              </>
                            ) : null}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setRead(l._id, !l.read)}
                          className="mr-2 text-xs font-medium text-blue-600 hover:underline"
                        >
                          {l.read ? "Mark unread" : "Mark read"}
                        </button>
                        <button type="button" onClick={() => remove(l._id)} className="text-xs font-medium text-red-600 hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
