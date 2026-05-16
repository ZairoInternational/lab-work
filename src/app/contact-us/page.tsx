"use client";

import { useState } from "react";
import axios from "axios";
import ContactSidebar from "@/src/components/contact-sidebar";

type FormState = {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  productName: string;
  note: string;
};

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  companyName: "",
  productName: "",
  note: "",
};

export default function ContactUsPage() {
  const [formData, setFormData] = useState<FormState>(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "warn" | "err"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      const res = await axios.post("/api/contact-lead", formData);
      if (res.data?.success) {
        setFormData(initial);
        if (res.data.emailSent) {
          setMessage({ type: "ok", text: "Thank you — your message was sent and our team will get back to you soon." });
        } else {
          setMessage({
            type: "warn",
            text:
              "Your enquiry was saved. Email was not sent — add MAIL_SENDER_EMAIL and MAIL_SENDER_APP_PASSWORD to .env.local (app password for the sender mailbox). Your details are still saved.",
          });
        }
      } else {
        setMessage({ type: "err", text: res.data?.message || "Something went wrong." });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage({ type: "err", text: err.response?.data?.message || "Could not submit. Please try again." });
      } else {
        setMessage({ type: "err", text: "Could not submit. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center lg:text-left">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">Contact us</span>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">We&apos;d love to hear from you</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-600 lg:mx-0">
            Tell us about your lab, your company, and the product you are interested in. A member of the Benchtop
            Equipment team will respond using the details you provide.
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          <ContactSidebar />

          <div>
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900">Send an enquiry</h2>

              {message ? (
                <div
                  className={`mb-6 rounded-lg px-4 py-3 text-sm ${
                    message.type === "ok"
                      ? "bg-green-50 text-green-800"
                      : message.type === "warn"
                        ? "bg-amber-50 text-amber-900"
                        : "bg-red-50 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                      Phone no. <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      autoComplete="tel"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 …"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-gray-700">
                    Company name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    autoComplete="organization"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Organization or institute"
                  />
                </div>

                <div>
                  <label htmlFor="productName" className="mb-2 block text-sm font-medium text-gray-700">
                    Product name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="productName"
                    name="productName"
                    type="text"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Equipment or model you are interested in"
                  />
                </div>

                <div>
                  <label htmlFor="note" className="mb-2 block text-sm font-medium text-gray-700">
                    Note
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Requirements, quantity, timeline, or other details (optional)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors duration-300 hover:bg-blue-700 disabled:opacity-60"
                >
                  <span>{isSubmitting ? "Sending…" : "Send message"}</span>
                  {!isSubmitting ? <span aria-hidden>→</span> : null}
                </button>
              </form>
            </div>

            <div className="mt-8 rounded-lg bg-blue-600 p-8 text-white">
              <h3 className="mb-6 text-center text-2xl font-semibold">Supporting labs across research & industry</h3>
              <p className="text-center text-sm text-blue-100">
                Quality equipment, clear documentation, and responsive support from enquiry to delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
