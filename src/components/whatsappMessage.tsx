"use client";
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
  const message = `Hello, I'm interested in buying the product "${product.name}" (ID: ${product._id}). Please share more details.`;

  // WhatsApp link
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors"
    >
       <FaWhatsapp className="w-5 h-5" />
      Checkout on WhatsApp
    </a>
  );
}
