"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Package } from "lucide-react";
import axios from "axios";

import CheckoutButton from "@/src/components/whatsappMessage";


import { useRouter } from "next/navigation";

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

type Props = { 
  params: Promise<{ categorySlug: string; productSlug: string }> 
};

export default function ProductPage({ params }: Props) {
  // const { categorySlug, productSlug } = await params;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   const [categorySlug, setCategorySlug] = useState<string>("");
  const [productSlug, setProductSlug] = useState<string>("");

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setCategorySlug(resolvedParams.categorySlug);
      setProductSlug(resolvedParams.productSlug);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {

    if (!productSlug || !categorySlug) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get<Product>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/particularProduct/${productSlug}`,
          { validateStatus: () => true } // prevents axios from throwing on 404
        );

        if (res.status !== 200 || !res.data) {
          setError("Product not found");
          setProduct(null);
          return;
        }

        const productData = res.data;

        // ✅ Verify category slug matches product
        if (
          typeof productData.category === "object" &&
          productData.category.slug !== categorySlug
        ) {
          setError("Category mismatch");
          setProduct(null);
          return;
        }

        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug, categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button onClick={()=> router.back()} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to{" "}
            {typeof product.category === "object"
              ? product.category.name
              : "Products"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className=" p-8">
              <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-md">
                {product.images ? (
                  <img
                    src={product.images}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <CheckoutButton product={product} />
                  
                </div>

                {/* Short Description */}
                {product.shortDescription && (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {product.shortDescription}
                  </p>
                )}

                {/* Description */}
                {product.description && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Description
                    </h2>
                    <div className="prose max-w-none">
                      <p className="prose whitespace-pre-line text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PDF Section - Full Width Horizontal */}
          {product.pdf && (
            <div className="px-8 lg:px-12 pb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Documentation
                </h2>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 p-4 flex items-center justify-between border-b">
                    <span className="font-medium text-gray-700">Product PDF</span>
                    <a
                      href={product.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Full PDF
                    </a>
                  </div>
                  <div className="p-4">
                    <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={product.pdf}
                        alt="Product PDF Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
