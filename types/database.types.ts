export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'buyer' | 'supplier' | 'admin';
export type SupplierType = 'nelayan_besar' | 'nelayan_perorangan' | 'pembudidaya';
export type OrderStatus =
  | 'menunggu_pembayaran'
  | 'dibayar'
  | 'diproses_supplier'
  | 'dikirim_ke_gudang'
  | 'dalam_pengiriman'
  | 'diterima'
  | 'dibatalkan';
export type CustomOrderStatus = 'mencari_mitra' | 'ditemukan' | 'disepakati' | 'gagal';
export type CertType = 'gap' | 'anti_overfishing' | 'lainnya';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface BuyerProfile {
  profile_id: string;
  business_name: string;
  business_type: string;
  address: string | null;
  location: unknown | null;
  subscription_tier: 'gratis' | 'premium';
}

export interface Supplier {
  id: string;
  profile_id: string;
  supplier_type: SupplierType;
  business_name: string;
  bio: string | null;
  location: unknown;
  address_label: string | null;
  is_trusted_badge: boolean;
  average_rating: number;
  created_at: string;
}

export interface SupplierCertification {
  id: string;
  supplier_id: string;
  cert_type: CertType;
  file_url: string | null;
  verified: boolean;
  created_at: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: unknown;
  address_label: string | null;
}

export interface Product {
  id: string;
  supplier_id: string;
  fish_name: string;
  description: string | null;
  price_per_kg: number;
  stock_kg: number;
  catch_or_harvest_date: string;
  season_tag: string | null;
  photo_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CustomOrderRequest {
  id: string;
  buyer_id: string;
  fish_name: string;
  size_spec: string | null;
  quantity_kg: number;
  target_price: number | null;
  status: CustomOrderStatus;
  matched_supplier_id: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  status: OrderStatus;
  delivery_schedule: string | null;
  warehouse_id: string | null;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  supplier_id: string;
  quantity_kg: number;
  price_per_kg_at_order: number;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: string;
  status: 'pending' | 'paid' | 'failed';
  paid_at: string | null;
}

export interface TrackingEvent {
  id: string;
  order_id: string;
  event_label: string;
  location_label: string | null;
  temperature_c: number | null;
  occurred_at: string;
}

export interface Notification {
  id: string;
  profile_id: string;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  order_id: string;
  buyer_id: string;
  supplier_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'> & { created_at?: string };
        Update: Partial<Profile>;
      };
      buyer_profiles: {
        Row: BuyerProfile;
        Insert: BuyerProfile;
        Update: Partial<BuyerProfile>;
      };
      suppliers: {
        Row: Supplier;
        Insert: Omit<Supplier, 'id' | 'created_at' | 'average_rating' | 'is_trusted_badge'> & {
          id?: string;
          created_at?: string;
          average_rating?: number;
          is_trusted_badge?: boolean;
        };
        Update: Partial<Supplier>;
      };
      supplier_certifications: {
        Row: SupplierCertification;
        Insert: Omit<SupplierCertification, 'id' | 'created_at' | 'verified'> & {
          id?: string;
          created_at?: string;
          verified?: boolean;
        };
        Update: Partial<SupplierCertification>;
      };
      warehouses: {
        Row: Warehouse;
        Insert: Omit<Warehouse, 'id'> & { id?: string };
        Update: Partial<Warehouse>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'is_active'> & {
          id?: string;
          created_at?: string;
          is_active?: boolean;
        };
        Update: Partial<Product>;
      };
      custom_order_requests: {
        Row: CustomOrderRequest;
        Insert: Omit<CustomOrderRequest, 'id' | 'created_at' | 'status'> & {
          id?: string;
          created_at?: string;
          status?: CustomOrderStatus;
        };
        Update: Partial<CustomOrderRequest>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'status' | 'subtotal'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          status?: OrderStatus;
          subtotal?: number;
        };
        Update: Partial<Order>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id'> & { id?: string };
        Update: Partial<OrderItem>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'status'> & { id?: string; status?: 'pending' | 'paid' | 'failed' };
        Update: Partial<Payment>;
      };
      tracking_events: {
        Row: TrackingEvent;
        Insert: Omit<TrackingEvent, 'id' | 'occurred_at'> & { id?: string; occurred_at?: string };
        Update: Partial<TrackingEvent>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at' | 'is_read'> & {
          id?: string;
          created_at?: string;
          is_read?: boolean;
        };
        Update: Partial<Notification>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Review>;
      };
    };
    Functions: {
      nearby_products: {
        Args: {
          buyer_lat: number;
          buyer_lng: number;
          radius_km?: number;
        };
        Returns: {
          product_id: string;
          fish_name: string;
          price_per_kg: number;
          supplier_id: string;
          supplier_name: string;
          distance_km: number;
          catch_or_harvest_date: string;
        }[];
      };
    };
  };
};
