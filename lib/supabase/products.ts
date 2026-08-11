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
 * Merges real products with default seed products and applies mock/local stock adjustments.
 */
export async function fetchProducts(): Promise<ProductWithSupplier[]> {
  const { getAdjustedStock } = await import("@/lib/mock-orders");
  const { getLocalStockDeductions } = await import("@/lib/local-orders");
  const localDeductions = typeof window !== "undefined" ? getLocalStockDeductions() : {};

  const calculateStock = (id: string, baseStock: number) => {
    const s1 = getAdjustedStock(id, baseStock);
    const dec = Number(localDeductions[id] || 0);
    return Math.max(0, s1 - dec);
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, suppliers(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return SEED_PRODUCTS.map((sp) => ({
        ...sp,
        stock_kg: calculateStock(sp.id, sp.stock_kg),
      }));
    }

    const realProducts: ProductWithSupplier[] = data.map((item, idx) => ({
      ...item,
      stock_kg: calculateStock(item.id, Number(item.stock_kg || 0)),
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
    ).map((sp) => ({
      ...sp,
      stock_kg: calculateStock(sp.id, sp.stock_kg),
    }));

    return [...realProducts, ...seedFiltered];
  } catch {
    return SEED_PRODUCTS.map((sp) => ({
      ...sp,
      stock_kg: calculateStock(sp.id, sp.stock_kg),
    }));
  }
}

/**
 * Fetch a single product by ID from Supabase.
 */
export async function fetchProductById(
  id: string
): Promise<ProductWithSupplier | null> {
  const { getAdjustedStock } = await import("@/lib/mock-orders");
  const { getLocalStockDeductions } = await import("@/lib/local-orders");
  const localDeductions = typeof window !== "undefined" ? getLocalStockDeductions() : {};

  const calculateStock = (pId: string, baseStock: number) => {
    const s1 = getAdjustedStock(pId, baseStock);
    const dec = Number(localDeductions[pId] || 0);
    return Math.max(0, s1 - dec);
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, suppliers(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      const seed = SEED_PRODUCTS.find((p) => p.id === id) || SEED_PRODUCTS[0];
      return {
        ...seed,
        stock_kg: calculateStock(seed.id, seed.stock_kg),
      };
    }

    return {
      ...data,
      stock_kg: calculateStock(data.id, Number(data.stock_kg || 0)),
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
    const seed = SEED_PRODUCTS.find((p) => p.id === id) || SEED_PRODUCTS[0];
    return {
      ...seed,
      stock_kg: calculateStock(seed.id, seed.stock_kg),
    };
  }
}
