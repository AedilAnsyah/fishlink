export interface CartItem {
  productId: string;
  fishName: string;
  pricePerKg: number;
  quantityKg: number;
  supplierId: string;
  supplierName: string;
  photoUrl?: string;
}

const CART_KEY = "fishlink_cart_v1";

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) {
      // Default initial mock cart item if empty for smooth testing
      return [
        {
          productId: "p2222222-2222-2222-2222-222222222222",
          fishName: "Kakap Merah Segar Tangkapan Subuh",
          pricePerKg: 85000,
          quantityKg: 20,
          supplierId: "s1111111-1111-1111-1111-111111111111",
          supplierName: "Tangkapan Pak Udung",
          photoUrl:
            "/fresh-fish.png",
        },
        {
          productId: "p1111111-1111-1111-1111-111111111111",
          fishName: "Tuna Sirip Kuning (Yellowfin) Grade A",
          pricePerKg: 115000,
          quantityKg: 15,
          supplierId: "s2222222-2222-2222-2222-222222222222",
          supplierName: "PT Laut Nusantara Jaya",
          photoUrl:
            "/fresh-fish.png",
        },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}
