import { SEED_PRODUCTS, SEED_SUPPLIERS, SeedProductWithSupplier } from "./supabase/seed-data";

export interface MockOrderItem {
  order_id: string;
  product_id: string;
  supplier_id: string;
  quantity_kg: number;
  price_per_kg_at_order: number;
  fish_name?: string;
  buyer_name?: string;
}

export interface MockOrder {
  id: string;
  buyer_id: string;
  buyerName: string;
  fishName: string;
  quantityKg: number;
  subtotal: number;
  status: string;
  dateLabel: string;
  delivery_schedule: string;
  created_at: string;
  supplier_id: string;
  supplierName: string;
  items: MockOrderItem[];
}

// Global in-memory storage for mock environment / fallback mode
const globalMockState = globalThis as unknown as {
  __fishlink_mock_orders?: MockOrder[];
  __fishlink_stock_adjustments?: Record<string, number>; // productId -> subtracted quantity
};

if (!globalMockState.__fishlink_mock_orders) {
  globalMockState.__fishlink_mock_orders = [];
}

if (!globalMockState.__fishlink_stock_adjustments) {
  globalMockState.__fishlink_stock_adjustments = {};
}

/**
 * Add a newly created order to in-memory mock store
 */
export function addMockOrder(order: MockOrder): void {
  if (!globalMockState.__fishlink_mock_orders) {
    globalMockState.__fishlink_mock_orders = [];
  }
  // Avoid duplicates
  const exists = globalMockState.__fishlink_mock_orders.some((o) => o.id === order.id);
  if (!exists) {
    globalMockState.__fishlink_mock_orders.unshift(order);
  }
}

/**
 * Get all mock orders, optionally filtered by supplierId
 */
export function getMockOrders(supplierId?: string): MockOrder[] {
  const orders = globalMockState.__fishlink_mock_orders || [];
  if (!supplierId) return orders;

  return orders.filter((o) => {
    if (o.supplier_id === supplierId) return true;
    if (o.items && o.items.some((it) => it.supplier_id === supplierId)) return true;
    return false;
  });
}

/**
 * Decrement stock for a product in-memory
 */
export function decrementMockStock(productId: string, quantityKg: number): void {
  if (!globalMockState.__fishlink_stock_adjustments) {
    globalMockState.__fishlink_stock_adjustments = {};
  }
  const current = globalMockState.__fishlink_stock_adjustments[productId] || 0;
  globalMockState.__fishlink_stock_adjustments[productId] = current + Number(quantityKg);
}

/**
 * Get adjusted stock for a given product ID
 */
export function getAdjustedStock(productId: string, baseStockKg: number): number {
  const deducted = globalMockState.__fishlink_stock_adjustments?.[productId] || 0;
  return Math.max(0, baseStockKg - deducted);
}

/**
 * Helper to get seed products with mock stock adjustments applied
 */
export function getAdjustedSeedProducts(): SeedProductWithSupplier[] {
  return SEED_PRODUCTS.map((prod) => {
    const remaining = getAdjustedStock(prod.id, prod.stock_kg);
    return {
      ...prod,
      stock_kg: remaining,
    };
  });
}
