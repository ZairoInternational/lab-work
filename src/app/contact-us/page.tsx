'use client'

import { useState } from 'react'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    appointmentType: 'Consultation',
    preferredDoctor: 'Dr. David Brown',
    preferredDate: '',
    preferredTime: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Contact Us</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">
              Contact Us Get your free estimate!
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue, diam ut hendrerit elementum, 
              dolor metus eleifend erat, vitae scelerisque massa justo non dolor. Cras in pulvinar augue. 
              Donec at consequat dui.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1579684288538-c76a2fab9617?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8M3xFQWFwVXNnbFFsY3x8ZW58MHx8fHx8" 
              alt="Contact Us"
              className="rounded-lg shadow-lg w-full max-w-md"
            />
          </div>

          {/* Right Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Team Will Respond</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex. John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter Phone Number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type of Appointment *</label>
                    <select
                      name="appointmentType"
                      value={formData.appointmentType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="Consultation">Consultation</option>
                      <option value="Testing">Testing</option>
                      <option value="Research">Research</option>
                      <option value="Analysis">Analysis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Scientist *</label>
                    <select
                      name="preferredDoctor"
                      value={formData.preferredDoctor}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="Dr. David Brown">Dr. David Brown</option>
                      <option value="Dr. Sarah Smith">Dr. Sarah Smith</option>
                      <option value="Dr. Michael Lee">Dr. Michael Lee</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
                    <input
                      type="time"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <span>→</span>
                </button>
              </form>
            </div>

            {/* Stats Section */}
            <div className="mt-8 bg-blue-600 text-white rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                Pioneering Laboratory Services for a Better Future
              </h3>
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">1100+</div>
                  <div className="text-blue-200">Research Process</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">200*</div>
                  <div className="text-blue-200">Concept to Discovery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
