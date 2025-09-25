const products = [
  {
    id: 1,
    name: "Mini Mixture",
    category: "Mixing",
    image: "/product-range/6.png",
  },
  {
    id: 2,
    name: "UV Analyzer",
    category: "Analysis",
    image: "product-range/14.png",
  },
  {
    id: 3,
    name: "UV Transilluminator",
    category: "Imaging",
    image: "product-range/13.png",
  },
  { id: 4, name: "Shaker", category: "Mixing", image: "product-range/12.png" },
  {
    id: 5,
    name: "Digital Shaker",
    category: "Mixing",
    image: "product-range/16.png",
  },
  { id: 6, name: "RTPCR", category: "Analysis", image: "product-range/11.png" },
  {
    id: 7,
    name: "Refrigerated Centrifuge",
    category: "Centrifuge",
    image: "product-range/9.png",
  },
  {
    id: 8,
    name: "Roller Mixer",
    category: "Mixing",
    image: "product-range/10.png",
  },
  {
    id: 9,
    name: "Mini Centrifuge",
    category: "Heating",
    image: "product-range/1.png",
  },
  {
    id: 10,
    name: "Mini Dry Bath Incubator",
    category: "Sterilization",
    image: "product-range/8.png",
  },
  {
    id: 11,
    name: "Orbital Shaker",
    category: "Imaging",
    image: "product-range/7.png",
  },
  {
    id: 12,
    name: "Lab Furniture",
    category: "Analysis",
    image: "product-range/5.png",
  },
  {
    id: 13,
    name: "Incubator Shaker",
    category: "Analysis",
    image: "product-range/3.png",
  },
  {
    id: 14,
    name: "Air Shower",
    category: "Mixing",
    image: "product-range/4.png",
  },
  {
    id: 15,
    name: "Freeze Dryer",
    category: "Heating",
    image: "product-range/2.png",
  },
  {
    id: 16,
    name: "Water Bath",
    category: "Dispensing",
    image: "product-range/15.png",
  },
];

export default function ProductRange() {
  return (
    <div className="relative bg-white py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50/30" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400/3 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl shadow-lg">
              <svg
                className="w-5 h-5  text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"
                />
              </svg>
            </div>
            <div className="h-px w-12 bg-gradient-to-r from-blue-400 to-transparent" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Our Product Range
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Precision-engineered laboratory solutions for modern research
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-8 justify-items-center">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative w-32 h-32 cursor-pointer"
              >
                {/* Main circle container */}
                <div className="absolute inset-0 rounded-full bg-white border-2 border-blue-200 group-hover:border-blue-400 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-200/50 overflow-hidden">
                  {/* Product image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-full opacity-90 group-hover:opacity-40 transition-all duration-300"
                  />

                  {/* Blue gradient overlay */}
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-500/20 group-hover:from-blue-500/20 group-hover:to-blue-600/30 transition-all duration-300 rounded-full" /> */}

                  {/* Hover text overlay */}
                  <div className="absolute inset-0 bg-blue-600/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full">
                    <div className="text-center px-2">
                      <span className="text-white font-semibold text-xs block leading-tight">
                        {product.name}
                      </span>
                      <span className="text-blue-100 text-xs mt-1 block">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Outer glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
