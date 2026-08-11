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
    const raw = localStorage.getItem(CART_KEY) || localStorage.getItem("fishlink_cart");
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  localStorage.setItem("fishlink_cart", JSON.stringify(items));
}

export function addToCart(newItem: CartItem): CartItem[] {
  const currentItems = getCartItems();
  const existingIdx = currentItems.findIndex((it) => it.productId === newItem.productId);

  let updated: CartItem[];
  if (existingIdx >= 0) {
    updated = currentItems.map((item, idx) => {
      if (idx === existingIdx) {
        return {
          ...item,
          quantityKg: item.quantityKg + newItem.quantityKg,
          pricePerKg: newItem.pricePerKg,
        };
      }
      return item;
    });
  } else {
    updated = [...currentItems, newItem];
  }

  saveCartItems(updated);
  return updated;
}

export function getCartCount(): number {
  const items = getCartItems();
  return items.length;
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem("fishlink_cart");
}
