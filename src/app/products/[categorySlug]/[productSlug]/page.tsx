"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, FileText, Package, ShoppingBag, Sparkles } from "lucide-react";
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
    // <div className="min-h-screen bg-gray-50">
    //   {/* Header */}
    //   <header className="bg-white shadow-sm border-b">
    //     <div className="container mx-auto px-4 py-4">
    //       <button onClick={()=> router.back()} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
    //         <ArrowLeft className="h-5 w-5 mr-2" />
    //         Back to{" "}
    //         {typeof product.category === "object"
    //           ? product.category.name
    //           : "Products"}
    //       </button>
    //     </div>
    //   </header>

    //   {/* Main Content */}
    //   <main className="container mx-auto px-4 py-8">
    //     <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    //       <div className="flex justify-around">
    //         {/* Image Section */}
    //         <div className=" p-8">
    //           <div className=" h-96 w-96 bg-white rounded-xl overflow-hidden shadow-md">
    //             {product.images ? (
    //               <img
    //                 src={product.images}
    //                 alt={product.name}
    //                 className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
    //               />
    //             ) : (
    //               <div className="w-full h-full flex items-center justify-center bg-gray-200">
    //                 <Package className="h-16 w-16 text-gray-400" />
    //               </div>
    //             )}
    //           </div>
    //         </div>

    //         {/* Product Info */}
    //         <div className="p-8 lg:p-12">
    //           <div className="space-y-6">
    //             {/* Header */}
    //             <div>
    //               <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
    //                 {product.name}
    //               </h1>
    //               <CheckoutButton product={product} />

    //             </div>

    //             {/* Short Description */}
    //             {product.shortDescription && (
    //               <div className="prose max-w-none">
    //                   <p className="prose whitespace-pre-line text-lg text-gray-600 leading-relaxed">
    //                     {product.shortDescription}
    //                   </p>
    //                 </div>
    //             )}

    //           </div>
    //         </div>
    //       </div>

    //        {/* Description */}
    //             {product.description && (
    //               <div className="px-8 lg:px-12 pb-8">
    //                 <h2 className="text-xl font-semibold text-gray-900 mb-4">
    //                   Description
    //                 </h2>
    //                 <div className="prose max-w-none">
    //                   <p className="prose whitespace-pre-line text-gray-600 text-lg leading-relaxed">
    //                     {product.description}
    //                   </p>
    //                 </div>
    //               </div>
    //             )}

    //       {/* PDF Section - Full Width Horizontal */}
    //       {product.pdf && (
    //         <div className="px-8 lg:px-12 pb-8">
    //           <div>
    //             <h2 className="text-xl font-semibold text-gray-900 mb-4">
    //               Product Specification
    //             </h2>
    //             <div className="border border-gray-100 flex justify-center rounded-xl overflow-hidden">

    //               <a
    //                   href={product.pdf}
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                   className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
    //                 >
    //                   <img
    //                     src={product.pdf}
    //                     alt="Product PDF Preview"
    //                     className="h-150 w-200 items-center object-contain"
    //                   />
    //                 </a>

    //             </div>
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   </main>
    // </div>

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Floating Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to{" "}
            {typeof product.category === "object"
              ? product.category.name
              : "Products"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Product Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Hero Section - Image & Info */}
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Gallery Section */}
            <div className="relative  p-6 sm:p-8 lg:p-12 flex items-center justify-center">
              {/* <div className="absolute top-4 right-4">
                {product.inStock !== false && (
                  <span className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold shadow-sm border border-emerald-100">
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    In Stock
                  </span>
                )}
              </div> */}

              <div className="relative w-full max-w-lg">
                <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 ">
                  {product.images ? (
                    <>
                      <img
                        src={product.images}
                        alt={product.name}
                        className={`w-full h-full object-contain p-6  `}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
                      <Package className="h-20 w-20 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
              <div className="space-y-6 lg:space-y-8">
                {/* Category Badge */}
                {typeof product.category === "object" && (
                  <div className="inline-flex">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                      {product.category.name}
                    </span>
                  </div>
                )}

                {/* Product Name */}
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
                    {product.name}
                  </h1>

                  {/* Price */}
                  {/* {product.price && (
                    <div className="inline-flex items-baseline space-x-2">
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-slate-500 text-lg">+ GST</span>
                    </div>
                  )} */}
                </div>

                {/* Short Description */}
                {product.shortDescription && (
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                      {product.shortDescription}
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                <div className="pt-4">
                  <CheckoutButton product={product} />
                </div>

                {/* Trust Indicators */}
                {/* <div className="pt-6 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-slate-900">
                        24/7
                      </div>
                      <div className="text-xs text-slate-600">Support</div>
                    </div>
                    <div className="space-y-1 border-x border-slate-100">
                      <div className="text-2xl font-bold text-slate-900">
                        100%
                      </div>
                      <div className="text-xs text-slate-600">Genuine</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-slate-900">
                        Fast
                      </div>
                      <div className="text-xs text-slate-600">Delivery</div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Full Description Section */}
          {product.description && (
            <div className="px-6 sm:px-8 lg:px-12 py-8 lg:py-12 bg-gradient-to-br from-slate-50/50 to-blue-50/20 border-t border-slate-100">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-blue-100 rounded-xl p-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Product Description
                  </h2>
                </div>

                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PDF/Specification Section */}
          {product.pdf && (
            <div className="px-6 sm:px-8 lg:px-12 py-8 lg:py-12 border-t border-slate-100">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-emerald-100 rounded-xl p-2">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Product Specification
                  </h2>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <a
                    href={product.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block relative"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.pdf}
                        alt="Product Specification"
                        className="w-full h-auto object-contain max-h-[600px] p-4 sm:p-8 group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Hover Overlay */}
                      {/* <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 via-blue-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-8">
                        <div className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <span>View Full Specification</span>
                          <ArrowLeft className="h-5 w-5 rotate-180" />
                        </div>
                      </div> */}
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info Cards */}
        {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-50 rounded-xl p-3 w-fit mb-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Quality Assured</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              All products undergo rigorous quality checks before dispatch.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-emerald-50 rounded-xl p-3 w-fit mb-4">
              <ShoppingBag className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Easy Returns</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Hassle-free returns within 7 days of delivery.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
            <div className="bg-purple-50 rounded-xl p-3 w-fit mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Expert Support</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our team is here to help with any product questions.
            </p>
          </div>
        </div> */}
      </main>
    </div>
  );
}

// "use client";
// import { useState, useEffect } from "react";
// import { ArrowLeft, Package, FileText, Sparkles, ShoppingBag } from "lucide-react";
// import axios from "axios";

// interface Category {
//   _id: string;
//   name: string;
//   slug: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   slug: string;
//   category: string | Category;
//   price?: number;
//   images: string;
//   pdf: string;
//   shortDescription?: string;
//   description?: string;
//   specs?: Record<string, string | number>;
//   inStock?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface ProductPageProps {
//   categorySlug: string;
//   productSlug: string;
//   onBack?: () => void;
// }

// export default function ProductPage({ categorySlug, productSlug, onBack }: ProductPageProps) {
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [imageLoaded, setImageLoaded] = useState(false);

// useEffect(() => {

//     if (!productSlug || !categorySlug) return;
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await axios.get<Product>(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/particularProduct/${productSlug}`,
//           { validateStatus: () => true } // prevents axios from throwing on 404
//         );

//         if (res.status !== 200 || !res.data) {
//           setError("Product not found");
//           setProduct(null);
//           return;
//         }

//         const productData = res.data;

//         // ✅ Verify category slug matches product
//         if (
//           typeof productData.category === "object" &&
//           productData.category.slug !== categorySlug
//         ) {
//           setError("Category mismatch");
//           setProduct(null);
//           return;
//         }

//         setProduct(productData);
//       } catch (err) {
//         console.error("Error fetching product:", err);
//         setError("Failed to load product");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productSlug, categorySlug]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
//             <div className="absolute inset-0 rounded-full bg-blue-50 blur-xl opacity-50"></div>
//           </div>
//           <p className="text-slate-600 font-medium">Loading product...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
//         <div className="text-center max-w-md">
//           <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100">
//             <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-6 mb-6 inline-block">
//               <Package className="h-16 w-16 text-slate-400" />
//             </div>
//             <h2 className="text-2xl font-bold text-slate-900 mb-3">
//               Product Not Found
//             </h2>
//             <p className="text-slate-600 leading-relaxed mb-6">
//               The product you're looking for doesn't exist or has been removed.
//             </p>
//             {onBack && (
//               <button
//                 onClick={onBack}
//                 className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
//               >
//                 <ArrowLeft className="h-5 w-5 mr-2" />
//                 Go Back
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
//       {/* Floating Header */}
//       <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <button
//             onClick={onBack}
//             className="group inline-flex items-center text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium"
//           >
//             <div className="bg-slate-100 rounded-lg p-2 mr-3 group-hover:bg-blue-100 transition-colors duration-200">
//               <ArrowLeft className="h-5 w-5 group-hover:text-blue-600 transition-colors duration-200" />
//             </div>
//             <span className="text-sm sm:text-base">
//               Back to{" "}
//               {typeof product.category === "object"
//                 ? product.category.name
//                 : "Products"}
//             </span>
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
//         {/* Product Card */}
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
//           {/* Hero Section - Image & Info */}
//           <div className="grid lg:grid-cols-2 gap-0">
//             {/* Image Gallery Section */}
//             <div className="relative bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 sm:p-8 lg:p-12 flex items-center justify-center">
//               <div className="absolute top-4 right-4">
//                 {product.inStock !== false && (
//                   <span className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold shadow-sm border border-emerald-100">
//                     <Sparkles className="h-4 w-4 mr-1.5" />
//                     In Stock
//                   </span>
//                 )}
//               </div>

//               <div className="relative w-full max-w-lg">
//                 <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 group">
//                   {product.images ? (
//                     <>
//                       {!imageLoaded && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-slate-100 animate-pulse">
//                           <Package className="h-16 w-16 text-slate-300" />
//                         </div>
//                       )}
//                       <img
//                         src={product.images}
//                         alt={product.name}
//                         className={`w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500 ${
//                           imageLoaded ? 'opacity-100' : 'opacity-0'
//                         }`}
//                         onLoad={() => setImageLoaded(true)}
//                       />
//                     </>
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
//                       <Package className="h-20 w-20 text-slate-300" />
//                     </div>
//                   )}
//                 </div>

//                 {/* Decorative Elements */}
//                 <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
//                 <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-2xl"></div>
//               </div>
//             </div>

//             {/* Product Details Section */}
//             <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
//               <div className="space-y-6 lg:space-y-8">
//                 {/* Category Badge */}
//                 {typeof product.category === "object" && (
//                   <div className="inline-flex">
//                     <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
//                       {product.category.name}
//                     </span>
//                   </div>
//                 )}

//                 {/* Product Name */}
//                 <div>
//                   <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
//                     {product.name}
//                   </h1>

//                   {/* Price */}
//                   {product.price && (
//                     <div className="inline-flex items-baseline space-x-2">
//                       <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
//                         {formatPrice(product.price)}
//                       </span>
//                       <span className="text-slate-500 text-lg">+ GST</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Short Description */}
//                 {product.shortDescription && (
//                   <div className="prose prose-slate max-w-none">
//                     <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
//                       {product.shortDescription}
//                     </p>
//                   </div>
//                 )}

//                 {/* CTA Button */}
//                 <div className="pt-4">
//                   <button className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-0.5">
//                     <ShoppingBag className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
//                     Get Quote
//                   </button>
//                 </div>

//                 {/* Trust Indicators */}
//                 <div className="pt-6 border-t border-slate-100">
//                   <div className="grid grid-cols-3 gap-4 text-center">
//                     <div className="space-y-1">
//                       <div className="text-2xl font-bold text-slate-900">24/7</div>
//                       <div className="text-xs text-slate-600">Support</div>
//                     </div>
//                     <div className="space-y-1 border-x border-slate-100">
//                       <div className="text-2xl font-bold text-slate-900">100%</div>
//                       <div className="text-xs text-slate-600">Genuine</div>
//                     </div>
//                     <div className="space-y-1">
//                       <div className="text-2xl font-bold text-slate-900">Fast</div>
//                       <div className="text-xs text-slate-600">Delivery</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Full Description Section */}
//           {product.description && (
//             <div className="px-6 sm:px-8 lg:px-12 py-8 lg:py-12 bg-gradient-to-br from-slate-50/50 to-blue-50/20 border-t border-slate-100">
//               <div className="max-w-4xl mx-auto">
//                 <div className="flex items-center space-x-3 mb-6">
//                   <div className="bg-blue-100 rounded-xl p-2">
//                     <FileText className="h-6 w-6 text-blue-600" />
//                   </div>
//                   <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
//                     Product Description
//                   </h2>
//                 </div>

//                 <div className="prose prose-slate prose-lg max-w-none">
//                   <p className="text-slate-700 leading-relaxed whitespace-pre-line text-base sm:text-lg">
//                     {product.description}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* PDF/Specification Section */}
//           {product.pdf && (
//             <div className="px-6 sm:px-8 lg:px-12 py-8 lg:py-12 border-t border-slate-100">
//               <div className="max-w-4xl mx-auto">
//                 <div className="flex items-center space-x-3 mb-6">
//                   <div className="bg-emerald-100 rounded-xl p-2">
//                     <FileText className="h-6 w-6 text-emerald-600" />
//                   </div>
//                   <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
//                     Product Specification
//                   </h2>
//                 </div>

//                 <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                   <a
//                     href={product.pdf}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="group block relative"
//                   >
//                     <div className="relative overflow-hidden">
//                       <img
//                         src={product.pdf}
//                         alt="Product Specification"
//                         className="w-full h-auto object-contain max-h-[600px] p-4 sm:p-8 group-hover:scale-105 transition-transform duration-500"
//                       />

//                       {/* Hover Overlay */}
//                       <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 via-blue-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-8">
//                         <div className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
//                           <span>View Full Specification</span>
//                           <ArrowLeft className="h-5 w-5 rotate-180" />
//                         </div>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Additional Info Cards */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
//           <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
//             <div className="bg-blue-50 rounded-xl p-3 w-fit mb-4">
//               <Package className="h-6 w-6 text-blue-600" />
//             </div>
//             <h3 className="font-bold text-slate-900 mb-2">Quality Assured</h3>
//             <p className="text-slate-600 text-sm leading-relaxed">
//               All products undergo rigorous quality checks before dispatch.
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
//             <div className="bg-emerald-50 rounded-xl p-3 w-fit mb-4">
//               <ShoppingBag className="h-6 w-6 text-emerald-600" />
//             </div>
//             <h3 className="font-bold text-slate-900 mb-2">Easy Returns</h3>
//             <p className="text-slate-600 text-sm leading-relaxed">
//               Hassle-free returns within 7 days of delivery.
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
//             <div className="bg-purple-50 rounded-xl p-3 w-fit mb-4">
//               <Sparkles className="h-6 w-6 text-purple-600" />
//             </div>
//             <h3 className="font-bold text-slate-900 mb-2">Expert Support</h3>
//             <p className="text-slate-600 text-sm leading-relaxed">
//               Our team is here to help with any product questions.
//             </p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
