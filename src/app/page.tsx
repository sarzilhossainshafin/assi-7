
import Link from "next/link";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types/product.type";

function toBanglaNumber(value: number | string): string {
  return String(value).replace(
    /\d/g,
    (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]
  );
}

function formatPrice(value: number): string {
  return toBanglaNumber(value.toLocaleString("en-US"));
}

function ProductCard({ product }: { product: Product }) {
  const change = product.change;
  const isUp = change?.dir === "up";
  const isDown = change?.dir === "down";

  const changeText =
    change?.pct === 0
      ? "০.০%"
      : `${toBanglaNumber(change?.pct ?? 0)}%`;

  const unitText: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    piece: "প্রতি পিস",
    dozen: "প্রতি ডজন",
    bundle: "প্রতি আঁটি",
  };

  return (
    <Link href={`/product/${product.slug}`} className="block h-full">
      <article className="flex min-h-24 h-full items-center justify-between gap-3 rounded-xl border border-[#e5ece6] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f6ef] text-xl">
            {product.image || product.categoryIcon || "🛒"}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-[#263b2c]">
              {product.nameBn}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {unitText[product.unit] ?? `প্রতি ${product.unit}`}
            </p>

            <p className="mt-1 text-sm font-extrabold text-[#203b29]">
              {formatPrice(product.today)} টাকা
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${
            isUp
              ? "bg-green-50 text-green-700"
              : isDown
                ? "bg-red-50 text-red-600"
                : "bg-gray-100 text-gray-500"
          }`}
        >
          {isUp ? "▲ " : isDown ? "▼ " : "— "}
          {changeText}
        </span>
      </article>
    </Link>
  );
}

function ProductSection({
  title,
  products,
  id,
  subtitle,
}: {
  title: string;
  products: Product[];
  id?: string;
  subtitle?: string;
}) {
  return (
    <section id={id} className="mt-7 scroll-mt-40">
      <div className="mb-3">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-[#263b2c] sm:text-lg">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-[#e5ece6] bg-white p-5 text-sm text-gray-500">
          এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function Home() {
  const products = await getProducts();

  const risingProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort(
      (a, b) =>
        (b.change?.pct ?? 0) - (a.change?.pct ?? 0)
    )
    .slice(0, 6);

  const fallingProducts = products
    .filter((product) => product.change?.dir === "down")
    .sort(
      (a, b) =>
        (b.change?.pct ?? 0) - (a.change?.pct ?? 0)
    )
    .slice(0, 6);

  return (
    <main className="min-h-screen flex-1 bg-[#f1f6f1] text-[#203b29]">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="grid min-h-[220px] items-center gap-4 overflow-hidden rounded-2xl border border-[#e3ebe3] bg-[#fbfdfb] px-5 py-6 sm:grid-cols-[1.4fr_0.6fr] sm:px-9 sm:py-8">
          <div>
            <span className="inline-flex rounded-full bg-[#e5f4e5] px-3 py-1 text-xs font-bold text-[#39834b]">
              📈 প্রতিদিনের বাজার আপডেট
            </span>

            <h1 className="mt-4 max-w-xl text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              আজকের বাজারের দাম
              <br className="hidden sm:block" /> এক নজরে
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-gray-600">
              চাল, ডাল, তেল, মাছ, মাংসসহ নিত্যপ্রয়োজনীয় পণ্যের
              বর্তমান দাম জানুন সহজেই।
            </p>

            <a
              href="#সব-পণ্য"
              className="mt-5 inline-flex rounded-lg bg-[#248342] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#196b34]"
            >
              সব পণ্য দেখুন ↓
            </a>
          </div>

          {/* Hero Illustration */}
          <div className="flex min-h-36 items-center justify-center">
            <div
              className="flex h-36 w-36 items-center justify-center rounded-full bg-[#e5f4e5] text-7xl sm:h-44 sm:w-44 sm:text-8xl"
              role="img"
              aria-label="বাজারের পণ্যের প্রতীক"
            >
              🛒
            </div>
          </div>
        </section>

        {/* Product Sections */}
        {products.length === 0 ? (
          <p className="mt-7 rounded-xl border border-red-200 bg-white p-5 text-sm text-red-600">
            পণ্যের তথ্য পাওয়া যায়নি। API URL ও response structure পরীক্ষা করো।
          </p>
        ) : (
          <>
            <ProductSection
              title="আজ দাম বেড়েছে ▲"
              products={risingProducts}
            />

            <ProductSection
              title="আজ দাম কমেছে ▼"
              products={fallingProducts}
            />

            <ProductSection
              id="সব-পণ্য"
              title="সব পণ্য"
              subtitle="নিত্যপ্রয়োজনীয় সব পণ্যের আজকের দাম এক নজরে দেখুন।"
              products={products}
            />
          </>
        )}
      </div>
    </main>
  );
}
