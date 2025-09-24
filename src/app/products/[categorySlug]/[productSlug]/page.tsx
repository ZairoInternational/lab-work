import { notFound } from "next/navigation";
import Image from "next/image";
import { connectDB } from "../../../../lib/db";
import CategoryModel from "../../../../models/category";
import ProductModel from "../../../../models/product";

 interface Category {
  _id: string;
  name: string;
  slug: string;
}

 interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string | Category; 
  price?: number;
  images: string;
  shortDescription?: string;
  description?: string;
  specs?: Record<string, string | number>;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type Props = { params: Promise<{ categorySlug: string; productSlug: string }> };

export default async function ProductPage({ params }: Props) {
  const { categorySlug, productSlug } = await params;

  await connectDB();

  const category = await CategoryModel.findOne({ slug: categorySlug }).lean<Category | null>();
  if (!category) return notFound();

  const product= await ProductModel.findOne({
    slug: productSlug,
    category: category._id,
  }).lean<Product | null>();
  if (!product) return notFound();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">

        <div>
          <div className="aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden">
            {product.images ? (
              <Image
                src={product.images}
                alt={product.name}
                width={1200}
                height={900}
                className="w-full h-full object-contain"
              />
            ) : null}
          </div>
          
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold">{product.name}</h1>
          {typeof product.price === "number" && (
            <div className="text-2xl text-blue-600 mt-2">₹{product.price}</div>
          )}
          {product.shortDescription && (
            <p className="text-gray-600 mt-4">{product.shortDescription}</p>
          )}

          {product.specs && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="text-sm">
                    <span className="font-medium">{k}: </span>
                    <span className="text-gray-700">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.description && (
            <div className="mt-6 prose max-w-none">
              <h2>Details</h2>
              <p>{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: Props) {
  const { productSlug, categorySlug } =await params;
  await connectDB();
  const product= await ProductModel.findOne({ slug: productSlug }).lean<Product | null>();
  return {
    title: product ? `${product.name} | ${categorySlug}` : "Product",
    description: product?.shortDescription,
  };
}
