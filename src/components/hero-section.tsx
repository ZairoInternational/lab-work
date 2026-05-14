'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const SLIDE_MS = 5000

const slides = [
  {
    id: 1,
    title: 'Advancing Science for a Better Tomorrow',
    subtitle: 'Research & Technology',
    description:
      'We are dedicated to groundbreaking discoveries, scientific excellence, and technological advancements that shape the future of healthcare, environment, and industry.',
    image: '/assets/homepage-banner1.png',
  },
  {
    id: 2,
    title: 'Precision Research for Reliable Results',
    subtitle: 'Research & Technology',
    description:
      'We are dedicated to groundbreaking discoveries, scientific excellence, and technological advancements that shape the future of healthcare, environment, and industry.',
    image: '/assets/homepage-banner2.png',
  },
  {
    id: 3,
    title: 'Pioneering Science for Global Progress',
    subtitle: 'Research & Technology',
    description:
      'We are dedicated to groundbreaking discoveries, scientific excellence, and technological advancements that shape the future of healthcare, environment, and industry.',
    image: '/assets/homepage-banner3.png',
  },
]

function preloadImages(urls: string[]) {
  urls.forEach((src) => {
    const img = new window.Image()
    img.src = src
  })
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplayKey, setAutoplayKey] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    preloadImages(slides.map((s) => s.image))
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [autoplayKey])

  const restartAutoplay = useCallback(() => {
    setAutoplayKey((k) => k + 1)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    restartAutoplay()
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    restartAutoplay()
  }

  const active = slides[currentSlide]

  return (
    <section className="relative h-screen overflow-hidden bg-neutral-900">
      {/* Background crossfade — opacity only (no scale) to avoid flash */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={index !== currentSlide}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
            draggable={false}
          />
        </div>
      ))}

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/60 via-black/35 to-black/25"
        aria-hidden
      />

      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide}
            className="max-w-3xl"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-6 py-3 bg-blue-400/20 backdrop-blur-sm border border-blue-400/30 text-blue-100 text-sm font-semibold uppercase tracking-widest rounded-full">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse" />
                {active.subtitle}
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                {active.title}
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-blue-100/90 leading-relaxed max-w-2xl">
              {active.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="group relative px-8 py-4 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-400/25 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center space-x-2">
                  <span>Explore Research</span>
                </span>
              </button>

              <button
                type="button"
                className="group px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 text-white font-semibold rounded-full transition-all duration-300"
              >
                <span className="group-hover:text-blue-100 transition-colors duration-300">Learn More</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-6 top-1/2 z-20 -translate-y-1/2 group"
        aria-label="Previous slide"
      >
        <div className="w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-blue-400/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
          <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors duration-300" />
        </div>
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-6 top-1/2 z-20 -translate-y-1/2 group"
        aria-label="Next slide"
      >
        <div className="w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-blue-400/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
          <ChevronRight className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors duration-300" />
        </div>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={slides[i].id}
            type="button"
            onClick={() => {
              setCurrentSlide(i)
              restartAutoplay()
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentSlide ? 'w-8 bg-blue-400' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress — resets with slide; scaleX avoids conflict with width */}
      <div className="absolute bottom-0 left-0 z-20 w-full h-1 bg-white/20">
        <div
          key={`${currentSlide}-${autoplayKey}`}
          className="h-full origin-left bg-gradient-to-r from-blue-400 to-blue-500"
          style={{
            animation: reduceMotion ? undefined : `hero-slide-progress ${SLIDE_MS}ms linear forwards`,
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes hero-slide-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  )
}
