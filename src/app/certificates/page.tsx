"use client"

import { Award } from "lucide-react"
import Image from "next/image"

export default function Component() {
  // 🎯 ADD YOUR CERTIFICATE IMAGE URLs HERE
  const certificateImages = [
    "/labs certificate/certificate-2024-2025_compressed_1.jpg", 
    "/labs certificate/certificate-2024-2025_compressed_2.jpg", 
    "/labs certificate/certificate-2024-2025_compressed_3.jpg", 
    "/labs certificate/certificate-2024-2025_compressed_4.jpg", 
    "/labs certificate/certificate-2024-2025_compressed_5.jpg", 
    "/labs certificate/certificate-2024-2025_compressed_6.jpg", 
    "/labs certificate/certificate-2024-2025_compressed_7.jpg", 
    "/labs certificate/certificate-2024-2025_compressed_8.jpg", 
    "/labs certificate/certificate-2024-2025_compressed_9.jpg", 
    "/labs certificate/certificate-2024-2025_compressed_10.jpg", 
    "/labs certificate/certificate-2024-2025_compressed_11.jpg", 
  ]

  const certifications = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    title: ` Certificate ${i + 1}`,
    issuer: "Certification Authority",
    date: "2024",
    imageUrl: certificateImages[i] || "",
  }))

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-400 rounded-2xl mb-8 shadow-lg">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">Certifications</h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              A curated collection of achievements and credentials
            </p>
          </div>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {certifications.map((cert) => (
            <div key={cert.id} className="group cursor-pointer">
              {/* Certificate Frame */}
              <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                {/* Certificate Image or Placeholder */}
                <div className="aspect-[1/1.414] relative overflow-hidden">
                  {cert.imageUrl ? (
                    // Show actual certificate image
                    <Image
                      src={cert.imageUrl || "/placeholder.svg"}
                      alt={cert.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    // Show placeholder
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden h-full">
                      {/* Decorative elements */}
                      <div className="absolute top-4 left-4 w-8 h-8 border-2 border-blue-400 rounded-full opacity-20"></div>
                      <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-blue-400 rounded-full opacity-10"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                          <Award className="w-12 h-12 text-blue-400" />
                        </div>
                        <div className="text-center">
                          <div className="w-32 h-2 bg-blue-400 rounded-full mx-auto mb-3"></div>
                          <div className="w-24 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
                          <div className="w-20 h-1 bg-gray-300 rounded-full mx-auto"></div>
                        </div>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                    </div>
                  )}

                  {/* Image overlay for better text readability when image is present */}
                  {cert.imageUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </div>

                {/* Certificate Info */}
                <div className="p-8">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-blue-400 transition-colors duration-300">
                      {cert.title}
                    </h3>
                    {/* <p className="text-gray-600 mb-2 font-light">{cert.issuer}</p>
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-400 text-sm font-medium rounded-full">
                      {cert.date}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
     
      </div>
    </div>
  )
}
