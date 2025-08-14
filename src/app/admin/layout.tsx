import Link from "next/link"

export default function AdminLayout({children}:{children:React.ReactNode}) {

    return (
       <div className="min-h-screen flex">
        <aside className="w-64 bg-gray-100 p-4">
            <h2 className="font-semibold mb-4">Admin</h2>
            <nav>
                <Link href="/admin">Dashboard</Link>
                <Link href="/admin/categories">Categories</Link>
                <Link href="/admin/product">Products</Link>
            </nav>
        </aside>
        <main>{children}</main>
       </div>
    )
}