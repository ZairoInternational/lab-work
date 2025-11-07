"use client";
import { ShoppingBag } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string | Category;
  price?: number;
  images: string;
  pdf: string;
  shortDescription?: string;
  description?: string;
  specs?: Record<string, string | number>;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function CheckoutButton({ product }: { product: Product }) {
  // Replace with your WhatsApp number (with country code, no + or spaces)
  const phoneNumber = "916307331072"; 

  // Pre-typed message
  const message = `Hello, I'm interested in buying the product "${product.name}" from your website. Please share more details.`;

  // WhatsApp link
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      // className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors"
    >
      <button className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-0.5">
                    <ShoppingBag className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    Get Quote
                  </button>
    </a>
  );
}
