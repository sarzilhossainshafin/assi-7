import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getProducts } from "@/lib/api";
import type { MarketPrice } from "@/types/product.type";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function bn(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
}

function money(value: number): string {
  return `৳${bn(value.toLocaleString("en-US"))}`;
}

const unitText: Record<string, string> = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  litre: "প্রতি লিটার",
  piece: "প্রতি পিস",
  dozen: "প্রতি ডজন",
  bundle: "প্রতি আঁটি",
};

function MarketPriceChart({
  markets,
}: {
  markets: MarketPrice[];
}) {
  if (markets.length === 0) {
    return (
      <p className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
        এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
      </p>
    );
  }

  const minPrice = Math.min(...markets.map((market) => market.min));
  const maxPrice = Math.max(...markets.map((market) => market.max));
  const range = maxPrice - minPrice || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-green-700" />
          সর্বনিম্ন দাম
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-lime-300" />
          দামের range
        </span>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{money(minPrice)}</span>
        <span>{money(maxPrice)}</span>
      </div>

      {markets.map((market, index) => {
        const left = ((market.min - minPrice) / range) * 100;
        const width = ((market.max - market.min) / range) * 100;

        return (
          <div
            key={`${market.division}-${market.market}-${index}`}
          >
            <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-[#203b29]">
                  {market.market}
                </p>
                <p className="text-xs text-gray-500">
                  {market.division}
                </p>
              </div>

              <p className="text-sm font-bold text-gray-700">
                {money(market.min)} – {money(market.max)}
              </p>
            </div>

            <div className="relative h-4 overflow-hidden rounded-full bg-gray-100">
              <div
                className="absolute top-0 h-full rounded-full bg-lime-300"
                style={{
                  left: `${left}%`,
                  width: `${Math.max(width, 0.8)}%`,
                }}
              />
              <div
                className="absolute top-0 h-full w-1 rounded-full bg-green-700"
                style={{ left: `${left}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-extrabold text-[#203b29] sm:text-3xl">
        {value}
      </p>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

export default async function ProductDetailsPage({
  params,
}: PageProps) {
  const { slug } = await params;

  // Protect this page on the server.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(
      `/signin?callbackURL=${encodeURIComponent(`/product/${slug}`)}&reason=login-required`
    );
  }

  const products = await getProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const markets = product.markets ?? [];

  const lowestPrice =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : null;

  const highestPrice =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : null;

  // Average of the midpoint prices reported by each market.
  const averagePrice =
    markets.length > 0
      ? markets.reduce(
          (total, market) => total + (market.min + market.max) / 2,
          0
        ) / markets.length
      : null;

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  const unit =
    unitText[product.unit] ?? `প্রতি ${product.unit}`;

  return (
    <main className="min-h-screen flex-1 bg-[#f1f6f1] px-4 py-8 text-[#203b29] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-700">
            হোম
          </Link>
          <span>/</span>
          <Link
            href={`/category/${product.category}`}
            className="hover:text-green-700"
          >
            {product.categoryNameBn}
          </Link>
          <span>/</span>
          <span className="font-semibold text-green-800">
            {product.nameBn}
          </span>
        </nav>

        <section className="mb-8 overflow-hidden rounded-2xl border border-green-100 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
            <div className="flex min-h-48 items-center justify-center bg-green-50 p-6">
              <span className="text-7xl" aria-hidden="true">
                {product.categoryIcon || product.image || "🛒"}
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <p className="mb-2 text-sm font-semibold text-green-700">
                {product.categoryNameBn} · {unit}
              </p>

              <h1 className="text-3xl font-extrabold sm:text-4xl">
                {product.nameBn}
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {product.nameBn}-এর আজকের বাজারদর এবং বিভিন্ন বাজারের
                দামের তুলনা এক জায়গায় দেখুন।
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <p className="text-3xl font-extrabold text-green-800 sm:text-4xl">
                  {money(product.today)}
                </p>

                <span className="text-sm text-gray-500">
                  আজকের দাম
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-bold ${
                    isUp
                      ? "bg-green-50 text-green-700"
                      : isDown
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isUp ? "▲ " : isDown ? "▼ " : "— "}
                  {bn(product.change?.pct ?? 0)}%
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                <span>গতকাল: {money(product.yesterday)}</span>
                <span>গত সপ্তাহ: {money(product.lastWeek)}</span>
                <span>গত মাস: {money(product.lastMonth)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <p className="text-sm font-bold tracking-widest text-green-700">
            MARKET COMPARISON
          </p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            বিভিন্ন বাজারে {product.nameBn}-এর দাম
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            বিভিন্ন বাজারের সর্বনিম্ন, সর্বোচ্চ ও গড় দামের তুলনা।
          </p>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="বাজারের সংখ্যা"
            value={bn(markets.length)}
          />
          <SummaryCard
            title="সর্বনিম্ন দাম"
            value={lowestPrice === null ? "—" : money(lowestPrice)}
            description={unit}
          />
          <SummaryCard
            title="সর্বোচ্চ দাম"
            value={highestPrice === null ? "—" : money(highestPrice)}
            description={unit}
          />
          <SummaryCard
            title="গড় দাম"
            value={averagePrice === null ? "—" : money(Math.round(averagePrice))}
            description={
              averagePrice === null
                ? "দামের তথ্য পাওয়া যায়নি"
                : `${unit} · বাজারগুলোর গড় মধ্যমূল্য`
            }
          />
        </section>

        <section className="mb-8 rounded-2xl border border-green-100 bg-white p-5 sm:p-7">
          <h2 className="mb-6 text-xl font-bold sm:text-2xl">
            বাজারভিত্তিক দামের তুলনা
          </h2>
          <MarketPriceChart markets={markets} />
        </section>

        <section className="overflow-hidden rounded-2xl border border-green-100 bg-white">
          <div className="p-5 sm:p-7">
            <h2 className="text-xl font-bold sm:text-2xl">
              বাজারভিত্তিক দামের তালিকা
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দাম।
            </p>
          </div>

          {markets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead className="bg-green-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">বাজার</th>
                    <th className="px-5 py-4 font-semibold">বিভাগ</th>
                    <th className="px-5 py-4 font-semibold">
                      সর্বনিম্ন
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      সর্বোচ্চ
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {markets.map((market, index) => (
                    <tr
                      key={`${market.division}-${market.market}-${index}`}
                      className="transition hover:bg-green-50"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {market.market}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {market.division}
                      </td>
                      <td className="px-5 py-4 font-bold text-green-700">
                        {money(market.min)}
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-800">
                        {money(market.max)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-5 pb-7 text-sm text-gray-500">
              এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
            </p>
          )}
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/category/${product.category}`}
            className="inline-flex rounded-lg border border-green-700 px-5 py-3 font-semibold text-green-800 transition hover:bg-green-50"
          >
            ← {product.categoryNameBn} ক্যাটাগরিতে ফিরে যাও
          </Link>

          <Link
            href="/"
            className="inline-flex rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}