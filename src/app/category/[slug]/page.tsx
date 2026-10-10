
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/api";
import CategoryProductList from "@/components/shared/CategoryProductList";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  // URL slug অনুযায়ী category খুঁজে বের করা
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  // এই category-র সব product বের করা
  const categoryProducts = products.filter(
    (product) => product.category === category.slug
  );

  return (
    <main className="min-h-screen bg-[#f1f6f1] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-green-700">
            হোম
          </Link>

          <span>/</span>

          <span className="font-semibold text-green-800">
            {category.nameBn}
          </span>
        </nav>

        {/* Category Header */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-4xl">
              {category.icon}
            </div>

            <div>
              <p className="text-sm font-semibold tracking-wide text-green-700">
                BAZARDOR CATEGORY
              </p>

              <h1 className="mt-1 text-2xl font-extrabold text-[#203b29] sm:text-3xl">
                {category.nameBn}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                এই ক্যাটাগরির পণ্যের বর্তমান বাজারদর দেখুন।
              </p>
            </div>
          </div>
        </section>

        {/* Products */}
        {categoryProducts.length > 0 ? (
          <CategoryProductList
            products={categoryProducts}
            categoryName={category.nameBn}
          />
        ) : (
          <section className="rounded-2xl border border-green-100 bg-white px-5 py-12 text-center">
            <p className="text-4xl">🛒</p>

            <h2 className="mt-4 text-xl font-bold text-[#203b29]">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              অন্য ক্যাটাগরি থেকে পণ্য দেখার চেষ্টা করো।
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              হোম পেজে ফিরে যাও
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
