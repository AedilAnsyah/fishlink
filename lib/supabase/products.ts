import { createClient } from "./client";
import { Product, Supplier, SupplierCertification } from "@/types/database.types";
import { SEED_PRODUCTS, type SeedProductWithSupplier } from "./seed-data";

export interface ProductWithSupplier extends Product {
  suppliers: Supplier;
  distance_km?: number;
  certifications?: SupplierCertification[];
}

/**
 * Fetch all active products from Supabase.
 * Falls back to SEED_PRODUCTS from centralized seed-data.ts
 * when Supabase is not configured.
 */
export async function fetchProducts(): Promise<ProductWithSupplier[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, suppliers(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return SEED_PRODUCTS;
    }

    return data.map((item, idx) => ({
      ...item,
      distance_km: (idx + 1) * 12,
    })) as ProductWithSupplier[];
  } catch {
    return SEED_PRODUCTS;
  }
}

/**
 * Fetch a single product by ID from Supabase.
 * Falls back to SEED_PRODUCTS from centralized seed-data.ts.
 */
export async function fetchProductById(
  id: string
): Promise<ProductWithSupplier | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, suppliers(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      const seed = SEED_PRODUCTS.find((p) => p.id === id);
      return seed || SEED_PRODUCTS[0];
    }

    return {
      ...data,
      distance_km: 12,
    } as ProductWithSupplier;
  } catch {
    const seed = SEED_PRODUCTS.find((p) => p.id === id);
    return seed || SEED_PRODUCTS[0];
  }
}
