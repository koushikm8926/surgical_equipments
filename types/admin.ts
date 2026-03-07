export interface OrderProfile {
  full_name: string | null;
  email: string | null;
}

export interface OrderItem {
  count: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: string;
  total_amount: number;
  shipping_address: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  profiles: OrderProfile | null;
  order_items: OrderItem[];
}

export interface SalesTrendPoint {
  created_at: string;
  total_amount: number;
}

export interface AdminStats {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  statusCounts: Record<string, number>;
  recentOrders: Order[];
  salesTrend: SalesTrendPoint[];
}

export interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  total_orders: number;
  total_spend: number;
}
