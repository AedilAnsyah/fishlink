export interface LocalOrder {
  id: string;
  buyerName: string;
  fishName: string;
  quantityKg: number;
  subtotal: number;
  status: string;
  dateLabel: string;
  supplierId: string;
  created_at: string;
}

const ORDERS_KEY = "fishlink_placed_orders_v1";
const STOCK_KEY = "fishlink_stock_deductions_v1";

export function getLocalOrders(): LocalOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY) || localStorage.getItem("fishlink_placed_orders");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalOrder(order: LocalOrder): void {
  if (typeof window === "undefined") return;
  const current = getLocalOrders();
  const exists = current.some((o) => o.id === order.id);
  if (!exists) {
    const updated = [order, ...current];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    localStorage.setItem("fishlink_placed_orders", JSON.stringify(updated));
  }
}

export function getLocalStockDeductions(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STOCK_KEY) || localStorage.getItem("fishlink_stock_deductions");
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export function recordLocalStockDeduction(productId: string, quantityKg: number): void {
  if (typeof window === "undefined") return;
  const current = getLocalStockDeductions();
  const prev = Number(current[productId] || 0);
  current[productId] = prev + Number(quantityKg);
  localStorage.setItem(STOCK_KEY, JSON.stringify(current));
  localStorage.setItem("fishlink_stock_deductions", JSON.stringify(current));
}
