"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import axios from "axios"
export default function Header() {
  type Category = {
    _id: string
    name: string
    slug: string
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get("/api/category/getCategory")
        setCategories(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50  ">
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
            <Link href="#" className="hover:text-blue-200">
              Facebook
            </Link>
            <Link href="#" className="hover:text-blue-200">
              Instagram
            </Link>
            <Link href="#" className="hover:text-blue-200">
              Pinterest
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 ">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/assets/benchtop_logo_big.png" alt="Labstica" className="h-12" />
          </Link>
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
            </div>
            <div className="relative group">
              <Link href="/about-us" className="text-gray-700 hover:text-blue-600 font-medium">
                About Us
              </Link>
            </div>
            <div
              className="relative"
            >
              <button
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors duration-200"
                onClick={() => setIsProductsOpen(!isProductsOpen)}
              >
                Products
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isProductsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProductsOpen && (
                <div className="absolute top-full left-0 bg-white shadow-xl border border-gray-200 rounded-lg mt-2 w-64 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                  {isLoading ? (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        Loading categories...
                      </div>
                    </div>
                  ) : categories.length > 0 ? (
                    <>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        Product Categories
                      </div>
                      {categories.map((cat, index) => (
                        <Link
                          key={cat._id}
                          href={`/products/${cat.slug}`}
                          className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 border-l-2 border-transparent hover:border-blue-400"
                          onClick={() => setIsProductsOpen(false)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{cat.name}</span>
                            <ChevronDown className="w-3 h-3 -rotate-90 text-gray-400" />
                          </div>
                        </Link>
                      ))}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-center">No categories available</div>
                  )}
                </div>
              )}
            </div>
            <div className="relative group">
              <Link href="/certificates" className="text-gray-700 hover:text-blue-600 font-medium">
                Certificates
              </Link>
            </div>
            <Link href="/contact-us" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 bg-blue-400 text-white rounded-sm relative">
              <Link href={"https://drive.google.com/file/d/17nWNeeKxxNTpVyfOVSzCpLOFtG4C12V2/view?pli=1"}>
                Catalogue
              </Link>
            </button>
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/about-us" className="text-gray-700 hover:text-blue-600 font-medium">
                About Us
              </Link>

              {/* Mobile Products Dropdown */}
              <div className="space-y-2">
                <button
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center justify-between w-full"
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                >
                  Products
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isProductsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isProductsOpen && (
                  <div className="pl-4 space-y-2 border-l-2 border-blue-100">
                    {isLoading ? (
                      <div className="text-gray-500 text-sm">Loading...</div>
                    ) : categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/products/${cat.slug}`}
                          className="block text-gray-600 hover:text-blue-600 text-sm py-1"
                          onClick={() => {
                            setIsProductsOpen(false)
                            setIsMenuOpen(false)
                          }}
                        >
                          {cat.name}
                        </Link>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">No categories available</div>
                    )}
                  </div>
                )}
              </div>

              <Link href="/certificates" className="text-gray-700 hover:text-blue-600 font-medium">
                Certificates
              </Link>
              <Link href="/contact-us" className="text-gray-700 hover:text-blue-600 font-medium">
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
