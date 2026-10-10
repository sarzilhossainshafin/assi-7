
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/types/product.type";

type SortOption =
  | "default"
  | "price-low"
  | "price-high"
  | "rising"
  | "falling";

type Props = {
  products: Product[];
  categoryName: string;
};

export default function CategoryProductList({
  products,
  categoryName,
}: Props) {
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    switch (sortBy) {
      case "price-low":
        return result.sort((a, b) => a.today - b.today);

      case "price-high":
        return result.sort((a, b) => b.today - a.today);

      case "rising":
        return result
          .filter((product) => product.change?.dir === "up")
          .sort((a, b) => b.change.pct - a.change.pct);

      case "falling":
        return result
          .filter((product) => product.change?.dir === "down")
          .sort((a, b) => b.change.pct - a.change.pct);

      default:
        return result;
    }
  }, [products, sortBy]);

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#203b29]">
            {categoryName} পণ্য
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {sortedProducts.length}টি পণ্য পাওয়া গেছে
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="product-sort"
            className="shrink-0 text-sm font-medium text-gray-600"
          >
            সাজান:
          </label>

          <select
            id="product-sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-600"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-low">দাম: কম থেকে বেশি</option>
            <option value="price-high">দাম: বেশি থেকে কম</option>
            <option value="rising">দাম বাড়ছে</option>
            <option value="falling">দাম কমছে</option>
          </select>
        </div>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => {
            const isUp = product.change?.dir === "up";
            const isDown = product.change?.dir === "down";

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                aria-label={`${product.nameBn} এর বাজারদর দেখুন`}
                className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-green-600"
              >
                <article className="h-full rounded-2xl border border-green-100 bg-white p-5 transition duration-200 group-hover:-translate-y-1 group-hover:border-green-300 group-hover:shadow-md">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-3xl">
                      {product.categoryIcon || "🛒"}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isUp
                          ? "bg-red-50 text-red-600"
                          : isDown
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                      {product.change?.pct ?? 0}%
                    </span>
                  </div>

                  <h3 className="mb-1 text-lg font-bold text-[#203b29]">
                    {product.nameBn}
                  </h3>

                  <p className="mb-4 text-xs text-gray-500">
                    প্রতি {product.unit}
                  </p>

                  <div className="rounded-xl bg-[#f1f6f1] p-4">
                    <p className="text-sm text-gray-500">আজকের দাম</p>
                    <p className="mt-1 text-2xl font-extrabold text-green-800">
                      ৳{product.today}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">
                        গতকালের দাম
                      </p>
                      <p className="mt-1 font-bold text-gray-700">
                        ৳{product.yesterday}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        গত সপ্তাহের দাম
                      </p>
                      <p className="mt-1 font-bold text-gray-700">
                        ৳{product.lastWeek}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 border-t border-gray-100 pt-3 text-sm font-semibold text-green-700">
                    বাজারের দাম দেখুন →
                  </p>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-green-100 bg-white px-5 py-12 text-center">
          <h3 className="text-lg font-bold text-[#203b29]">
            এই ক্যাটাগরিতে কোনো পণ্য নেই
          </h3>
        </div>
      )}
    </section>
  );
}
