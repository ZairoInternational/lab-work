import { notFound } from "next/navigation";
import Image from "next/image";
import { connectDB } from "../../../lib/db";
import Category from "../../../models/category";
import Product from "../../../models/product";
import Link from "next/link";

type Props = { params: { categorySlug: string } };

interface Category {
    _id: string;
    name: string;
    slug: string;
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = params;

  await connectDB();
  const category = await Category.findOne({ slug: categorySlug }).lean<Category | null>();
  if (!category) return notFound();

  const products = await Product.find({ category: category._id }).lean();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl lg:text-3xl font-semibold mb-6">
        {category.name}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-600">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p: any) => (
            <Link
              key={p._id}
              href={`/products/${categorySlug}/${p.slug}`}
              className="border rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden mb-3">
                {p.images?.[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="font-medium">{p.name}</div>
              {typeof p.price === "number" && (
                <div className="text-blue-600 mt-1">₹{p.price}</div>
              )}
              {p.shortDescription && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.shortDescription}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

