'use client'

import { useState } from 'react'

const services = [
  {
    id: 1,
    number: "01",
    title: "Scientific Research",
    description: "Lorem Ipsum is simply dummy text of the printing and Ut convallis augue ut sapien lobortis, typesetting industry.",
    image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bGFib3JhdG9yeXxlbnwwfHwwfHx8MA%3D%3Dh"
  },
  {
    id: 2,
    number: "02", 
    title: "Process Optimization",
    description: "Lorem Ipsum is simply dummy text of the printing and Ut convallis augue ut sapien lobortis, typesetting industry.",
    image: "https://plus.unsplash.com/premium_photo-1676325101955-1089267548d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxhYm9yYXRvcnl8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: 3,
    number: "03",
    title: "Material Advancements", 
    description: "Lorem Ipsum is simply dummy text of the printing and Ut convallis augue ut sapien lobortis, typesetting industry.",
    image: "https://images.unsplash.com/photo-1606206848010-83949917a080?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGxhYm9yYXRvcnl8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: 4,
    number: "04",
    title: "Chemical Analysis",
    description: "Lorem Ipsum is simply dummy text of the printing and Ut convallis augue ut sapien lobortis, typesetting industry.",
    image: "https://plus.unsplash.com/premium_photo-1682146302312-1fcc0cd0417d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODl8fGxhYm9yYXRvcnl8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: 5,
    number: "05",
    title: "Environmental Testing",
    description: "Lorem Ipsum is simply dummy text of the printing and Ut convallis augue ut sapien lobortis, typesetting industry.",
    image: "https://images.unsplash.com/photo-1624957485502-cd76eb9ac7fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIyfHxsYWJvcmF0b3J5fGVufDB8fDB8fHww"
  }
]

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(0)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-4">
            Our Comprehensive Laboratory & Research Services
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`grid lg:grid-cols-2 gap-12 items-center mb-20 transition-all duration-500 ${
                index === activeService ? 'opacity-100' : 'opacity-50'
              }`}
              onMouseEnter={() => setActiveService(index)}
            >
              <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="flex items-start space-x-6">
                  <span className="text-6xl font-bold text-blue-100">{service.number}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors duration-300">
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                <img 
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
