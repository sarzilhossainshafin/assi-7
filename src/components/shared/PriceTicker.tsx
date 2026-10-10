
import { getProducts } from "@/lib/api";

export default async function PriceTicker() {
  const products = await getProducts();

  if (!products.length) return null;

  const tickerProducts = products
    .filter((product) => product.change)
    .slice(0, 10);

  if (!tickerProducts.length) return null;

  return (
    <section className="flex w-full overflow-hidden border-b border-green-100 bg-white">
      <div className="z-10 flex shrink-0 items-center gap-2 bg-green-700 px-3 py-3 text-sm font-bold text-white sm:px-5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
        <span className="whitespace-nowrap">বাজারদর আপডেট</span>
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="bazar-marquee-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="bazar-marquee-group"
              aria-hidden={copy === 1}
            >
              {tickerProducts.map((product) => {
                const up = product.change.dir === "up";
                const down = product.change.dir === "down";

                return (
                  <div
                    key={product.slug}
                    className="flex shrink-0 items-center gap-2 border-r border-gray-200 px-5 py-3"
                  >
                    <span className="text-lg">
                      {product.categoryIcon || product.image || "🛒"}
                    </span>

                    <span className="whitespace-nowrap text-sm font-semibold text-gray-700">
                      {product.nameBn}
                    </span>

                    <span className="whitespace-nowrap text-sm font-bold text-gray-900">
                      ৳{product.today}/{product.unit}
                    </span>

                    <span
                      className={`whitespace-nowrap text-xs font-bold ${
                        up
                          ? "text-red-600"
                          : down
                            ? "text-green-700"
                            : "text-gray-500"
                      }`}
                    >
                      {up ? "▲" : down ? "▼" : "—"}{" "}
                      {product.change.pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
