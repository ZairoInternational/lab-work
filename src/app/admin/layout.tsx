
"use client"

import type React from "react"
import AdminGuard from "@/src/components/admin-guard"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { div } from "framer-motion/client"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname();
  console.log("pathname",pathname);

  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-gray-50">
        {pathname === "/admin" ? (
          <div></div>
        ) : (
          <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-400 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Admin</h2>
                  <p className="text-sm text-gray-500">Dashboard</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 p-6">
              {" "}
              <div className="space-y-2">
                {" "}
                <NavLink href="/admin/dashboard" icon={DashboardIcon}>
                  {" "}
                  Dashboard{" "}
                </NavLink>{" "}
                <NavLink href="/admin/categories" icon={CategoryIcon}>
                  {" "}
                  Categories{" "}
                </NavLink>{" "}
                <NavLink href="/admin/product" icon={ProductIcon}>
                  {" "}
                  Products{" "}
                </NavLink>{" "}
              </div>{" "}
            </nav>
          </aside>
        )}

        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </AdminGuard>
  );
}

function NavLink({
  href,
  children,
  icon: Icon,
}: {
  href: string
  children: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
}) {
  
  const isActive = false

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "bg-blue-50 text-blue-600 border border-blue-100"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
       }
      `}
    >
      <Icon className={`w-5 h-5 ${isActive ? "text-blue-500" : "text-gray-400"}`} />
      {children}
    </Link>
  )
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
    </svg>
  )
}

function CategoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  )
}

function ProductIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  )
}