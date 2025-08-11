'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: "Advancing Science for a Better Tomorrow",
    subtitle: "Research & Technology",
    description: "We are dedicated to groundbreaking discoveries, scientific excellence, and technological advancements that shape the future of healthcare, environment, and industry.",
    image: "/assets/homepage-banner1.png"
  },
  {
    id: 2,
    title: "Precision Research for Reliable Results",
    subtitle: "Research & Technology",     
    description: "We are dedicated to groundbreaking discoveries, scientific excellence, and technological advancements that shape the future of healthcare, environment, and industry.",
    image: "/assets/homepage-banner2.png"
  },
  {
    id: 3,
    title: "Pioneering Science for Global Progress",
    subtitle: "Research & Technology",
    description: "We are dedicated to groundbreaking discoveries, scientific excellence, and technological advancements that shape the future of healthcare, environment, and industry.",
    image: "/assets/homepage-banner3.png"
  }
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-screen  overflow-hidden ">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
               style={{ backgroundImage: `url(${slide.image})` }}>
            <div className="absolute inset-0 " />
            <div className="absolute inset-0 " />
          </div>
          
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
            <div className="max-w-3xl">
              {/* Animated subtitle */}
              <div className="mb-6 transform transition-all duration-700 delay-300">
                <span className="inline-flex items-center px-6 py-3 bg-blue-400/20 backdrop-blur-sm border border-blue-400/30 text-blue-100 text-sm font-semibold uppercase tracking-widest rounded-full">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                  {slide.subtitle}
                </span>
              </div>

              {/* Main title with gradient */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight transform transition-all duration-700 delay-500">
                <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                  {slide.title}
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl mb-10 text-blue-100/90 leading-relaxed max-w-2xl transform transition-all duration-700 delay-700">
                {slide.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 transform transition-all duration-700 delay-900">
                <button className="group relative px-8 py-4 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-400/25 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <span>Explore Research</span>
                    
                  </div>
                </button>
                
                <button className="group px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 text-white font-semibold rounded-full transition-all duration-300">
                  <span className="group-hover:text-blue-100 transition-colors duration-300">Learn More</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 group"
      >
        <div className="w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-blue-400/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
          <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors duration-300" />
        </div>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 group"
      >
        <div className="w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-blue-400/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
          <ChevronRight className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors duration-300" />
        </div>
      </button>

  
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            animation: 'progress 5s linear infinite'
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  )
}
