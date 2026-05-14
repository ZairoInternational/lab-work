import nodemailer from "nodemailer";
import { LEADS_INBOX_EMAIL } from "@/src/config/leads-mail";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type LeadEmailPayload = {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  productName: string;
  note: string;
};

/**
 * Sends lead emails via Gmail SMTP using **exactly two secrets** in `.env.local`:
 *
 * 1. **`MAIL_SENDER_EMAIL`** — The Google mailbox that **sends** mail (your “no-reply” style address:
 *    a `@gmail.com` / Google Workspace address). This must be the same account the app password belongs to.
 * 2. **`MAIL_SENDER_APP_PASSWORD`** — [App password](https://myaccount.google.com/apppasswords) for that mailbox (16 characters; spaces OK).
 *
 * **Recipients** are always **`benchtop.admiin@gmail.com`** (see `src/config/leads-mail.ts`).
 *
 * Optional: **`MAIL_SENDER_NAME`** — display name in the From header (default: `Benchtop Equipment`).
 *
 * Backward compatibility: if `MAIL_SENDER_*` are unset, `GMAIL_USER` + `GMAIL_APP_PASSWORD` are still read.
 */
export async function sendLeadEmail(payload: LeadEmailPayload): Promise<{ sent: boolean; error?: string }> {
  const sender =
    process.env.MAIL_SENDER_EMAIL?.trim() || process.env.GMAIL_USER?.trim() || "";
  const appPassword =
    process.env.MAIL_SENDER_APP_PASSWORD?.replace(/\s/g, "").trim() ||
    process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "").trim() ||
    "";

  if (!sender || !appPassword) {
    return {
      sent: false,
      error: "Set MAIL_SENDER_EMAIL and MAIL_SENDER_APP_PASSWORD in .env.local (Gmail app password for the sender account).",
    };
  }

  const fromName = process.env.MAIL_SENDER_NAME?.trim() || "Benchtop Equipment";
  const from = `${fromName} <${sender}>`;
  const to = LEADS_INBOX_EMAIL;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: sender, pass: appPassword },
  });

  const rows: [string, string][] = [
    ["Name", payload.name],
    ["Phone", payload.phone],
    ["Email", payload.email],
    ["Company", payload.companyName],
    ["Product", payload.productName],
    ["Note", payload.note || "—"],
  ];

  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:140px">${escapeHtml(k)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: payload.email,
      subject: `[Benchtop Lead] ${payload.name} — ${payload.productName}`,
      text: `New enquiry from the website contact form.\n\n${text}`,
      html: `<p style="font-family:system-ui,sans-serif;font-size:14px;color:#111">New enquiry from the website contact form.</p><table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">${htmlRows}</table>`,
    });
    return { sent: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "send failed";
    console.error("[sendLeadEmail]", msg);
    return { sent: false, error: msg };
  }
}
