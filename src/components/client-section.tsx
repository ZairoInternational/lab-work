'use client'

import { useState, useEffect } from 'react'

const clients = [
  { id: 1, name: "Client 1", logo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9nb3xlbnwwfHwwfHx8MA%3D%3D" },
  { id: 2, name: "Client 2", logo: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bG9nb3xlbnwwfHwwfHx8MA%3D%3D" },
  { id: 3, name: "Client 3", logo: "https://images.unsplash.com/photo-1619551734325-81aaf323686c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxvZ298ZW58MHx8MHx8fDA%3D" },
  { id: 4, name: "Client 4", logo: "https://images.unsplash.com/photo-1553835973-dec43bfddbeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGxvZ298ZW58MHx8MHx8fDA%3D" },
  { id: 5, name: "Client 5", logo: "https://images.unsplash.com/photo-1529612700005-e35377bf1415?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGxvZ298ZW58MHx8MHx8fDA%3D" },
  { id: 6, name: "Client 6", logo: "https://images.unsplash.com/photo-1708376368427-ede2b537d494?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGxvZ298ZW58MHx8MHx8fDA%3D " }
]

export default function ClientsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % clients.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-lg font-medium text-gray-600 relative inline-block">
            <span className="bg-white px-6 relative z-10">We Worked With Global Latest Brands</span>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -z-10"></div>
          </h3>
        </div>

        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 5)}%)` }}
          >
            {[...clients, ...clients].map((client, index) => (
              <div key={`${client.id}-${index}`} className="w-1/5 flex-shrink-0 px-4">
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group">
                  <img 
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    className="w-full h-16 object-contain mx-auto filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
