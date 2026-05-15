"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import axios from "axios"

export default function Header() {
  type Category = {
    _id: string
    name: string
    slug: string
  }

  type ContactInfo = {
    address: string
    phone1: string
    phone2: string
  }

  type SearchResult = {
    categories: { name: string; slug: string }[]
    products: { name: string; slug: string; category: { name: string; slug: string } }[]
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "128 Near Golden Mall London Eye",
    phone1: "+91 9956499800",
    phone2: "+91 9807850733",
  })
  const [searchQ, setSearchQ] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult>({ categories: [], products: [] })
  
  const searchRef = useRef<HTMLDivElement>(null)
  const searchDebounceRef = useRef<number | null>(null)
  const searchQTrimmed = useMemo(() => searchQ.trim(), [searchQ])

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

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get("/api/contact-info")
        if (res?.data) setContactInfo(res.data)
      } catch (error) {
        // keep defaults on failure
      }
    }
    fetchContactInfo()
  }, [])

  useEffect(() => {
    const onDocMouseDown = (event: MouseEvent) => {
      const t = event.target as Node
      if (searchRef.current && !searchRef.current.contains(t)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocMouseDown)
    return () => document.removeEventListener("mousedown", onDocMouseDown)
  }, [])

  useEffect(() => {
    if (!searchQTrimmed) {
      setSearchResults({ categories: [], products: [] })
      return
    }

    if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = window.setTimeout(async () => {
      try {
        setSearchLoading(true)
        const res = await axios.get("/api/search", { params: { q: searchQTrimmed } })
        setSearchResults(res.data ?? { categories: [], products: [] })
      } catch {
        setSearchResults({ categories: [], products: [] })
      } finally {
        setSearchLoading(false)
      }
    }, 250)

    return () => {
      if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current)
    }
  }, [searchQTrimmed])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50  ">
      <div className="bg-blue-400 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <span>{contactInfo.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>{contactInfo.phone1}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>{contactInfo.phone2}</span>
            </div>
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
              className="relative hidden lg:block"
              onMouseEnter={() => setDesktopProductsOpen(true)}
              onMouseLeave={() => setDesktopProductsOpen(false)}
            >
              <div
                className={`flex cursor-default select-none items-center gap-1 py-2 font-medium transition-colors duration-200 ${
                  desktopProductsOpen ? "text-blue-600" : "text-gray-700"
                }`}
                aria-haspopup="menu"
                aria-expanded={desktopProductsOpen}
                aria-label="Products menu"
              >
                Products
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
                    desktopProductsOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div
                className={`absolute left-0 top-full z-50 w-64 pt-2 transition-all duration-150 ease-out ${
                  desktopProductsOpen
                    ? "pointer-events-auto visible translate-y-0 opacity-100"
                    : "pointer-events-none invisible -translate-y-1 opacity-0"
                }`}
              >
                <div
                  role="menu"
                  aria-label="Product categories"
                  className="rounded-lg border border-gray-200 bg-white py-2 shadow-xl"
                >
                  {isLoading ? (
                    <div className="px-4 py-3 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                        Loading categories...
                      </div>
                    </div>
                  ) : categories.length > 0 ? (
                    <>
                      <div className="border-b border-gray-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Product Categories
                      </div>
                      {categories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/products/${cat.slug}`}
                          role="menuitem"
                          className="flex min-h-[3rem] w-full items-center justify-between gap-3 border-l-2 border-transparent px-4 py-3 text-gray-700 transition-colors duration-150 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span className="font-medium">{cat.name}</span>
                          <ChevronDown className="h-3 w-3 shrink-0 -rotate-90 text-gray-400" aria-hidden />
                        </Link>
                      ))}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-500">No categories available</div>
                  )}
                </div>
              </div>
            </div>
            <div className="relative group">
              <Link href="/certificates" className="text-gray-700 hover:text-blue-600 font-medium">
                Certificates
              </Link>
            </div>
            <Link href="/achievements" className="text-gray-700 hover:text-blue-600 font-medium">
              Achievements
            </Link>
            <Link href="/contact-us" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact Us
            </Link>
          </nav>

          <div className="hidden lg:block w-full max-w-md mx-6" ref={searchRef}>
            <div className="relative">
              <input
                value={searchQ}
                onChange={(e) => {
                  setSearchQ(e.target.value)
                  setSearchOpen(true)
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search products or categories…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />

              {searchOpen && searchQTrimmed ? (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
                  {searchLoading ? (
                    <div className="px-4 py-3 text-sm text-gray-600">Searching…</div>
                  ) : (
                    <div className="max-h-80 overflow-auto">
                      {searchResults.categories.length === 0 && searchResults.products.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-600">No results.</div>
                      ) : null}

                      {searchResults.categories.length ? (
                        <div className="py-2">
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Categories
                          </div>
                          {searchResults.categories.map((c) => (
                            <Link
                              key={`c-${c.slug}`}
                              href={`/products/${c.slug}`}
                              className="flex min-h-[2.75rem] w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                              onClick={() => setSearchOpen(false)}
                            >
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      ) : null}

                      {searchResults.products.length ? (
                        <div className="py-2 border-t border-gray-100">
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Products
                          </div>
                          {searchResults.products.map((p) => (
                            <Link
                              key={`p-${p.category.slug}-${p.slug}`}
                              href={`/products/${p.category.slug}/${p.slug}`}
                              className="flex min-h-[2.75rem] w-full items-center justify-between gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                              onClick={() => setSearchOpen(false)}
                            >
                              <span className="font-medium">{p.name}</span>
                              <span className="shrink-0 text-xs text-gray-500">{p.category.name}</span>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://drive.google.com/file/d/17nWNeeKxxNTpVyfOVSzCpLOFtG4C12V2/view?pli=1"
              className="inline-flex items-center justify-center rounded-sm bg-blue-400 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              Catalogue
            </Link>
            <button
              type="button"
              className="rounded-full p-2 hover:bg-gray-100 lg:hidden"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => {
                setIsMenuOpen((open) => {
                  if (open) setIsMobileProductsOpen(false)
                  return !open
                })
              }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                  type="button"
                  className="flex w-full items-center justify-between py-2 text-left font-medium text-gray-700 hover:text-blue-600"
                  aria-expanded={isMobileProductsOpen}
                  onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                >
                  Products
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isMobileProductsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isMobileProductsOpen && (
                  <div className="space-y-1 border-l-2 border-blue-100 pl-4">
                    {isLoading ? (
                      <div className="text-sm text-gray-500">Loading...</div>
                    ) : categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/products/${cat.slug}`}
                          className="flex min-h-[2.75rem] w-full items-center rounded-md px-2 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => {
                            setIsMobileProductsOpen(false)
                            setIsMenuOpen(false)
                          }}
                        >
                          {cat.name}
                        </Link>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No categories available</div>
                    )}
                  </div>
                )}
              </div>

              <Link href="/certificates" className="text-gray-700 hover:text-blue-600 font-medium">
                Certificates
              </Link>
              <Link href="/achievements" className="text-gray-700 hover:text-blue-600 font-medium">
                Achievements
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