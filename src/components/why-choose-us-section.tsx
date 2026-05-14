'use client'

import { useState } from 'react'
import { Microscope, TestTube, FlaskConical, Users } from 'lucide-react'

const services = [
  {
    id: 1,
    title: "Built for real lab work",
    description:
      "Benchtop solutions are developed around practical workloads—repeatable results, sensible footprints, and equipment that fits how your team actually works day to day.",
    icon: Microscope,
    image: "https://images.pexels.com/photos/3082451/pexels-photo-3082451.jpeg",
  },
  {
    id: 2,
    title: "Tested end to end",
    description:
      "Quality controllers and supervisors verify performance at multiple stages, from manufacturing through final checks, so only thoroughly validated products are released for delivery.",
    icon: TestTube,
    image: "https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg",
  },
  {
    id: 3,
    title: "Efficient to own and run",
    description:
      "We emphasize reliable output with lower operating and maintenance overhead—helping you protect uptime and total cost of ownership without compromising on standards.",
    icon: FlaskConical,
    image: "https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg",
  },
  {
    id: 4,
    title: "Client-first, start to finish",
    description:
      "Clear communication, dependable logistics, and responsive support mean you are not navigating orders, documentation, or after-sales questions on your own.",
    icon: Users,
    image: "https://images.pexels.com/photos/3735782/pexels-photo-3735782.jpeg",
  },
]

export default function WhyChooseUsSection() {
  const [activeService, setActiveService] = useState(3) // Default to 4th item (index 3)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Why choose us?</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-4">
            Why teams choose Benchtop Equipment
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg leading-relaxed">
            Design discipline, rigorous verification, and accountable service—the same priorities we use
            when supporting research, diagnostics, education, and industry labs across the country.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={service.id}
                className={`relative cursor-pointer transition-all duration-300 ${
                  index === activeService 
                    ? 'transform -translate-y-4' 
                    : 'hover:transform hover:-translate-y-2'
                }`}
                onMouseEnter={() => setActiveService(index)}
              >
                <div className={` rounded-lg shadow-lg overflow-hidden ${
                  index === activeService ? 'shadow-xl' : ''
                }`}>
                  <div className="relative">
                    <img 
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute inset-0 transition-all duration-300 ${
                      index === activeService 
                        ? ' bg-opacity-80' 
                        : 'bg-opacity-0 hover:bg-opacity-20'
                    }`} />
                    {index === activeService && (
                      <div className="absolute inset-0 flex items-center justify-center">
                       
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-lg mb-4 ${
                      index === activeService ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        index === activeService ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>
                    <button className={`p-2 rounded-full transition-colors duration-300 ${
                      index === activeService 
                        ? 'bg-blue-600 ' 
                        : 'bg-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white'
                    }`}>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}