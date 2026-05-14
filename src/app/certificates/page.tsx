"use client";

import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import Image from "next/image";
import axios from "axios";

type Certificate = {
  _id: string;
  name: string;
  image: string;
};

export default function CertificatesPage() {
  const [certifications, setCertifications] = useState<Certificate[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    axios
      .get<Certificate[]>("/api/certificates")
      .then((res) => {
        if (!cancelled) {
          setCertifications(Array.isArray(res.data) ? res.data : []);
          setLoadError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCertifications([]);
          setLoadError("Could not load certificates.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
            {loadError ? <p className="mt-4 text-sm text-amber-700">{loadError}</p> : null}
          </div>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {certifications.length === 0 ? (
            <div className="col-span-full text-center py-16 px-4">
              <p className="text-gray-500 text-lg font-light max-w-md mx-auto">
                No certificates are published yet. Add certificate images and names in the admin under Certificates.
              </p>
            </div>
          ) : (
            certifications.map((cert) => (
              <div key={cert._id} className="group cursor-pointer">
                <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-[1/1.414] relative overflow-hidden">
                    {cert.image ? (
                      <Image
                        src={cert.image}
                        alt={cert.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden h-full">
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
                        <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                      </div>
                    )}

                    {cert.image ? (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    ) : null}
                  </div>

                  <div className="p-8">
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-blue-400 transition-colors duration-300">
                        {cert.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
      </div>
    </div>
  );
}
