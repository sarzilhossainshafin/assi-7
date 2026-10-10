
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types/product.type";

type CategoryNavigationProps = {
  categories: Category[];
};

export default function CategoryNavigation({
  categories,
}: CategoryNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="পণ্যের ক্যাটাগরি"
      className="flex items-center gap-1 overflow-x-auto border-t border-gray-100 py-2"
    >
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
          pathname === "/"
            ? "bg-[#65a30d] text-white"
            : "text-gray-600 hover:bg-lime-50 hover:text-[#65a30d]"
        }`}
      >
        সব পণ্য
      </Link>

      {categories.map((category) => {
        const isActive =
          pathname === `/category/${category.slug}`;

        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-[#65a30d] text-white"
                : "text-gray-600 hover:bg-lime-50 hover:text-[#65a30d]"
            }`}
          >
            <span aria-hidden="true">
              {category.icon || "🛒"}
            </span>
            <span>{category.nameBn}</span>
          </Link>
        );
      })}
    </nav>
  );
}
