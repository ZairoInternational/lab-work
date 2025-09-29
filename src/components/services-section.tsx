"use client"
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const products =  [
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

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate products for seamless infinite scroll
  const extendedProducts = [...products, ...products, ...products];
  const itemsPerView = 7;

  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        // Reset to beginning when we've scrolled through one full set
        if (next >= products.length) {
          return 0;
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % products.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative py-10 ">
      {/* Background Elements */}


      <div className="relative container min-w-full ">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"
                />
              </svg>
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-slate-300 to-transparent" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
            Laboratory Solutions
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Precision-engineered equipment for modern research and analysis
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative max-w-full "
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Carousel Viewport */}
          <div className="overflow-hidden  backdrop-blur-sm border border-white/20 c p-8">
            <div 
              className="flex transition-transform duration-700 ease-out gap-6"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                width: `${(extendedProducts.length*20) / itemsPerView}%`
              }}
            >
              {extendedProducts.map((product, index) => (
                <div 
                  key={`${product.id}-${Math.floor(index / products.length)}`}
                  className="group relative flex-shrink-0 cursor-pointer"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg group-hover:shadow-2xl transition-all duration-500">
                    {/* Product Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white font-semibold text-lg mb-1 leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-white/80 text-sm font-medium">
                        {product.category}
                      </p>
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-slate-400/0 group-hover:ring-slate-400/30 transition-all duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={goToPrevious}
            className="absolute left-10 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 hover:shadow-2xl transition-all duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-10 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 hover:shadow-2xl transition-all duration-300 group"
          >
            <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Play/Pause Control */}
          {/* <button
            onClick={togglePlayPause}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-16 w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            ) : (
              <Play className="w-4 h-4 ml-0.5 group-hover:scale-110 transition-transform duration-200" />
            )}
          </button> */}

          {/* Progress Dots */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-28 flex gap-2">
            {products.slice(0, Math.ceil(products.length / itemsPerView)).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerView)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / itemsPerView) === index
                    ? 'bg-slate-800 w-8'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 right-8 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse" />
        <div className="absolute top-1/3 left-8 w-2 h-2 bg-slate-400/30 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-blue-300/15 rounded-full animate-pulse delay-500" />
      </div>
    </div>
  );
}