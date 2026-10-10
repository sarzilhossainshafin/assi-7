
import type { Product, Category } from "@/types/product.type";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

// API response থেকে array বের করার helper
function getArray(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    const response = data as Record<string, unknown>;

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response.products)) {
      return response.products;
    }

    if (Array.isArray(response.categories)) {
      return response.categories;
    }

    if (response.data && typeof response.data === "object") {
      const nested = response.data as Record<string, unknown>;

      if (Array.isArray(nested.products)) {
        return nested.products;
      }

      if (Array.isArray(nested.categories)) {
        return nested.categories;
      }
    }
  }

  return [];
}

async function fetchAPI(endpoint: string): Promise<unknown> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${endpoint} (${response.status})`
    );
  }

  return response.json();
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchAPI("/products");
    return getArray(data) as Product[];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchAPI("/categories");
    return getArray(data) as Category[];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getProductById(
  id: string | number
): Promise<Product | null> {
  try {
    const data = await fetchAPI(`/products/${id}`);

    if (data && typeof data === "object") {
      const response = data as Record<string, unknown>;

      if (response.product) {
        return response.product as Product;
      }

      if (response.data && typeof response.data === "object") {
        const nested = response.data as Record<string, unknown>;

        if (nested.product) {
          return nested.product as Product;
        }

        return response.data as Product;
      }

      return data as Product;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}
