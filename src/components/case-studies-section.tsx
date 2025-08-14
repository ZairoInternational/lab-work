"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const caseStudies = [
  {
    id: 1,
    title: "Pharmaceutical Research",
    category: "Research",
    description:"Pioneering breakthrough research methodologies that revolutionize laboratory efficiency and scientific discovery processes through cutting-edge technology integration.",
    image:"/we-make-for/1.png",
  },
  {
    id: 2,
    title: "Biomedical Research",
    category: "Creation",
    description:"Developing next-generation laboratory equipment and protocols that enhance precision, safety, and reproducibility in scientific experiments across multiple disciplines.",
    image:"/we-make-for/2.png",
  },
  {
    id: 3,
    title: "Environmental Research",
    category: "Creation",
    description:"Leading innovative research initiatives that push the boundaries of scientific knowledge and create sustainable solutions for global challenges.",
    image:"/we-make-for/3.png",
  },
  {
    id: 4,
    title: "Life Science Research",
    category: "Developments",
    description:"Shaping tomorrow's scientific landscape through innovative technologies, collaborative research, and transformative discoveries that benefit humanity.",
    image:"/we-make-for/4.png",
  },
  {
    id: 5,
    title: "Diagnostics & Healthcare",
    category: "Knowledge",
    description:"Fostering international collaboration and knowledge sharing to accelerate scientific progress and address complex global challenges through unified research efforts.",
    image:"/we-make-for/5.png",
  },
  {
    id: 6,
    title:"Food & Beverages",
    category: "Innovation",
    description:"Unveiling groundbreaking scientific innovations that push the boundaries of knowledge and revolutionize industries through cutting-edge research and technological advancements.",
    image:"/we-make-for/6.png",
  },
  {
    id: 7,
    title:"Industrial Process",
    category: "Innovation",
    description:"Unveiling groundbreaking scientific innovations that push the boundaries of knowledge and revolutionize industries through cutting-edge research and technological advancements.",
    image:"/we-make-for/7.png",
  },
  {
    id: 8,
    title:"Schools & Universities",
    category: "Innovation",
    description:"Unveiling groundbreaking scientific innovations that push the boundaries of knowledge and revolutionize industries through cutting-edge research and technological advancements.",
    image:"/we-make-for/8.png",
  }
]

export default function CaseStudiesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const visibleCards = 3
  
  const extendedStudies = [
    ...caseStudies.slice(-visibleCards), 
    ...caseStudies,
    ...caseStudies.slice(0, visibleCards), 
  ]

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
  }

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)

        // Reset to actual position when reaching clones
        if (currentIndex >= caseStudies.length + visibleCards) {
          setCurrentIndex(visibleCards)
        } else if (currentIndex < visibleCards) {
          setCurrentIndex(caseStudies.length + visibleCards - 1)
        }
      }, 500) // Match transition duration

      return () => clearTimeout(timer)
    }
  }, [currentIndex, isTransitioning])

  const getActualIndex = () => {
    if (currentIndex < visibleCards) {
      return currentIndex + caseStudies.length - visibleCards
    } else if (currentIndex >= caseStudies.length + visibleCards) {
      return currentIndex - caseStudies.length - visibleCards
    }
    return currentIndex - visibleCards
  }

  return (
    <section className="py-20 bg-[url('/assets/chem.png')] ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-white/20 rounded-full px-6 py-2 mb-4">
            <span className="text-white font-semibold text-lg uppercase tracking-wider">Case Studies</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-4xl mx-auto">
            Transforming Ideas into Scientific Achievements
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto ">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
            aria-label="Previous case study"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
            aria-label="Next case study"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <div className="overflow-hidden py-6">
            <div
              className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
            >
              {extendedStudies.map((study, index) => (
                <div key={`${study.id}-${index}`} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                  <div className="group perspective-1000 h-80">
                    <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                      {/* Front of card */}
                      <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden shadow-lg">
                        <div className="relative h-full">
                          <img
                            src={study.image || "/placeholder.svg"}
                            alt={study.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <span className="inline-block bg-blue-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-2">
                              {study.category}
                            </span>
                            <h3 className="text-xl font-bold leading-tight">{study.title}</h3>
                          </div>
                        </div>
                      </div>

                      {/* Back of card */}
                      <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-lg overflow-hidden shadow-lg bg-white">
                        <div className="h-full flex flex-col justify-center p-8">
                          <div className="text-center">
                            <span className="inline-block bg-blue-400 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
                              {study.category}
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{study.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">{study.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .group:hover .group-hover\\:rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  )
}
