'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, ShoppingBag, Phone } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50  ">
      {/* Top Header */}
      <div className="bg-blue-400 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>📧</span>
              <span>info@peacefulqode.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <span>128 Near Golden Mall London Eye</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>+91 9956499800</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>+91 9807850733</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            
            <Link href="#" className="hover:text-blue-200">Facebook</Link>
            <Link href="#" className="hover:text-blue-200">Instagram</Link>
            <Link href="#" className="hover:text-blue-200">Pinterest</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 ">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/assets/benchtop_logo_big.png" alt="Labstica" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            </div>
            <div className="relative group">
              <Link href="/about-us" className="text-gray-700 hover:text-blue-600 font-medium">About Us</Link>
            </div>
            <div className="relative group">
              <Link href="/services" className="text-gray-700 hover:text-blue-600 font-medium">Products</Link>
            </div>
            <div className="relative group">
              <Link href="/certificates" className="text-gray-700 hover:text-blue-600 font-medium">Certificates</Link>
            </div>
            {/* <div className="relative group">
              <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">Blog</Link> */}
            {/* </div> */}
            <Link href="/contact-us" className="text-gray-700 hover:text-blue-600 font-medium">Contact Us</Link>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
           
            <button className="p-2 bg-blue-400 text-white rounded-sm relative">
                 <Link href={"https://drive.google.com/file/d/17nWNeeKxxNTpVyfOVSzCpLOFtG4C12V2/view?pli=1"}>Catalogue</Link>
            </button>
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link href="/about-us" className="text-gray-700 hover:text-blue-600 font-medium">About Us</Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600 font-medium">Services</Link>
              <Link href="/certificates" className="text-gray-700 hover:text-blue-600 font-medium">Portfolio</Link>
              <Link href="/contact-us" className="text-gray-700 hover:text-blue-600 font-medium">Contact Us</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
