'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const caseStudies = [
  {
    id: 1,
    title: "Innovative Lab Solutions",
    category: "Research",
    image: "https://images.unsplash.com/photo-1606206522398-de3bd05b1615?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTB8RUFhcFVzZ2xRbGN8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    title: "Pioneering Lab Projects", 
    category: "Creation",
    image: "https://images.unsplash.com/photo-1583911860331-9fd6ce32c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8OXxFQWFwVXNnbFFsY3x8ZW58MHx8fHx8"
  },
  {
    id: 3,
    title: "Research at the Forefront",
    category: "Creation", 
    image: "https://images.unsplash.com/photo-1579154341184-22069e4614d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTZ8RUFhcFVzZ2xRbGN8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 4,
    title: "Future of Science",
    category: "Developments",
    image: "https://images.unsplash.com/photo-1643625794877-b808168ba474?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MjB8RUFhcFVzZ2xRbGN8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 5,
    title: "Advancing Global Research",
    category: "Knowledge",
    image: "https://images.unsplash.com/photo-1579684288538-c76a2fab9617?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8M3xFQWFwVXNnbFFsY3x8ZW58MHx8fHx8"
  }
]

export default function CaseStudiesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % caseStudies.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length)
  }

  return (
    <section className="py-20 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-wider">Case Studies</span>
          <h2 className="text-4xl font-bold mt-4">
            Transforming Ideas into Scientific Achievements
          </h2>
        </div>

        <div className="relative">
          <div className="flex overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 25}%)` }}
            >
              {caseStudies.map((study) => (
                <div key={study.id} className="w-1/4 flex-shrink-0 px-4">
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300">
                    <div className="relative overflow-hidden">
                      <img 
                        src={study.image }
                        alt={study.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center">
                        <button className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-20 p-3 rounded-full">
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="text-sm font-medium">{study.category}</span>
                      <h3 className="text-gray-900 font-semibold mt-2">{study.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
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
        </div>
      </div>
    </section>
  )
}
