import Link from 'next/link'
import { Facebook, Instagram, Github, MapPin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img 
              src="/assets/Lab-logo.png" 
              alt="Labstica"
              className="h-12 mb-6"
            />
            <p className="text-gray-400 mb-6 leading-relaxed">
              There are many variations of passages by injected humour randomised
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Useful Link</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors duration-300">Our Services</Link></li>
              <li><Link href="/process" className="text-gray-400 hover:text-white transition-colors duration-300">Our Process</Link></li>
              <li><Link href="/team" className="text-gray-400 hover:text-white transition-colors duration-300">Our Team</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/services/scientific-vision" className="text-gray-400 hover:text-white transition-colors duration-300">Scientific Vision Hub</Link></li>
              <li><Link href="/services/pathology" className="text-gray-400 hover:text-white transition-colors duration-300">Pathologycam Testing</Link></li>
              <li><Link href="/services/quantum" className="text-gray-400 hover:text-white transition-colors duration-300">Quantum Analysis Labs</Link></li>
              <li><Link href="/services/chemical" className="text-gray-400 hover:text-white transition-colors duration-300">Chemical Research</Link></li>
              <li><Link href="/services/technology" className="text-gray-400 hover:text-white transition-colors duration-300">Latest Technology</Link></li>
            </ul>
          </div>

          {/* Recent News */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Recent News</h4>
            <div className="space-y-4">
              <div className="flex space-x-3">
                <img 
                  src="/assets/research tools.png" 
                  alt="News"
                  className="w-15 h-15 rounded object-cover flex-shrink-0"
                />
                <div>
                  <h6 className="text-sm font-medium mb-2 leading-tight">
                    <Link href="/blog/discovering-science" className="hover:text-blue-400 transition-colors duration-300">
                      Discovering Science Through Precision and Dedication
                    </Link>
                  </h6>
                  <p className="text-xs text-gray-400">May 5, 2024</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <img 
                  src="/assets/laboratory research.png" 
                  alt="News"
                  className="w-15 h-15 rounded object-cover flex-shrink-0"
                />
                <div>
                  <h6 className="text-sm font-medium mb-2 leading-tight">
                    <Link href="/blog/journey-through-science" className="hover:text-blue-400 transition-colors duration-300">
                      A Journey Through Science, Innovation, and Laboratory Excellence
                    </Link>
                  </h6>
                  <p className="text-xs text-gray-400">May 5, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>Proudly Powered By Copyright 2025 labstica Theme by Peacefulqode | All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
