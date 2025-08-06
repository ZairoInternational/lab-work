'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Dr. John Miller",
    role: "Neurologist",
    content: "Focuses on diagnosing and managing disorders affecting the brain, spinal cord, and nervous system. Treats conditions like epilepsy, Parkinson's disease, strokes, and multiple sclerosis, using tests, imaging, and treatments for improved health. Lorem Ipsum is simply dummy text of the industry.",
    image: "https://plus.unsplash.com/premium_photo-1676325102493-e8ff690d7a40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2NpZW50aXN0fGVufDB8fDB8fHww"
  },
  {
    id: 2,
    name: "Dr. Emily Clark", 
    role: "Pediatrician",
    content: "Focuses on diagnosing and managing disorders affecting the brain, spinal cord, and nervous system. Treats conditions like epilepsy, Parkinson's disease, strokes, and multiple sclerosis, using tests, imaging, and treatments for improved health. Lorem Ipsum is simply dummy text of the industry.",
    image: "https://plus.unsplash.com/premium_photo-1676325102493-e8ff690d7a40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2NpZW50aXN0fGVufDB8fDB8fHww"
  },
  {
    id: 3,
    name: "Dr. Robert King",
    role: "Orthopedist", 
    content: "Focuses on diagnosing and managing disorders affecting the brain, spinal cord, and nervous system. Treats conditions like epilepsy, Parkinson's disease, strokes, and multiple sclerosis, using tests, imaging, and treatments for improved health. Lorem Ipsum is simply dummy text of the industry.",
    image: "https://plus.unsplash.com/premium_photo-1676325102493-e8ff690d7a40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2NpZW50aXN0fGVufDB8fDB8fHww"
  },
  {
    id: 4,
    name: "Dr. Sarah Evans",
    role: "Obstetrician",
    content: "Focuses on diagnosing and managing disorders affecting the brain, spinal cord, and nervous system. Treats conditions like epilepsy, Parkinson's disease, strokes, and multiple sclerosis, using tests, imaging, and treatments for improved health. Lorem Ipsum is simply dummy text of the industry.",
    image: "https://plus.unsplash.com/premium_photo-1676325102493-e8ff690d7a40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2NpZW50aXN0fGVufDB8fDB8fHww"
  }
]

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Testimonials</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-4">
            Testimonials from Research & Industry Leaders
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Testimonial Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-8">
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                "{testimonials[currentTestimonial].content}"
              </p>
              
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-blue-600">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-full transition-colors duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="p-3 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-full transition-colors duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Rating Card */}
          <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
            <img 
              src="https://plus.unsplash.com/premium_photo-1661438058994-d13fec8543f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNjaWVudGlzdCUyMHRlYW18ZW58MHx8MHx8fDA%3D" 
              alt="Laboratory Team"
              className="w-full rounded-lg mb-6"
            />
            
            <div className="mb-4">
              <img 
                src="https://images.unsplash.com/photo-1631556759511-6ce895fbf0ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNjaWVudGlzdHxlbnwwfHwwfHx8MA%3D%3D" 
                alt="Google Reviews"
                className="mx-auto mb-4"
              />
            </div>
            
            <h3 className="text-2xl font-bold mb-4">25k reviews</h3>
            
            <div className="flex justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : i === 4 ? 'fill-yellow-400/50 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
