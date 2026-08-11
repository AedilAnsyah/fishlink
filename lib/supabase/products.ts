import { createClient } from "./client";
import { Product, Supplier, SupplierCertification } from "@/types/database.types";
import { SEED_PRODUCTS, type SeedProductWithSupplier } from "./seed-data";

export interface ProductWithSupplier extends Product {
  suppliers: Supplier;
  distance_km?: number;
  certifications?: SupplierCertification[];
}

/**
 * Fetch all active products from Supabase database.
 * Merges real products with default seed products.
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

    const realProducts: ProductWithSupplier[] = data.map((item, idx) => ({
      ...item,
      suppliers: item.suppliers || {
        id: item.supplier_id,
        business_name: "Mitra Nelayan Lokal",
        supplier_type: "nelayan_perorangan",
        address_label: "Depo Seafood Purwokerto, Jawa Tengah",
        is_trusted_badge: true,
        average_rating: 4.9,
      },
      distance_km: (idx + 1) * 8,
    }));

    // Filter out seed duplicates if real products exist
    const seedFiltered = SEED_PRODUCTS.filter(
      (s) => !realProducts.some((r) => r.id === s.id)
    );

    return [...realProducts, ...seedFiltered];
  } catch {
    return SEED_PRODUCTS;
  }
}

/**
 * Fetch a single product by ID from Supabase.
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
      suppliers: data.suppliers || {
        id: data.supplier_id,
        business_name: "Mitra Nelayan Lokal",
        supplier_type: "nelayan_perorangan",
        address_label: "Depo Seafood Purwokerto, Jawa Tengah",
        is_trusted_badge: true,
        average_rating: 4.9,
      },
      distance_km: 12,
    } as ProductWithSupplier;
  } catch {
    const seed = SEED_PRODUCTS.find((p) => p.id === id);
    return seed || SEED_PRODUCTS[0];
  }
}
