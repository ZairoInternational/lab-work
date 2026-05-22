"use client";

import { FaWhatsapp } from "react-icons/fa";
import { whatsappHref } from "@/src/lib/whatsapp";

const DEFAULT_MESSAGE =
  "Hello Benchtop Equipment, I would like to enquire about your laboratory products.";

export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappHref(DEFAULT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition hover:scale-105 hover:bg-[#20bd5a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
    >
      <FaWhatsapp className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
    </a>
  );
}
