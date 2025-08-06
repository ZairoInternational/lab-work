'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    <section className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
            
          >
            <div className="absolute inset-0  bg-opacity-40" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <span className="inline-block px-4 py-2 bg-blue-600 text-sm font-medium uppercase tracking-wider rounded-full mb-4">
                {slide.subtitle}
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="text-xl mb-8 text-gray-200 leading-relaxed">
                {slide.description}
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium transition-colors duration-300 flex items-center space-x-2">
                <span>View Research</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
