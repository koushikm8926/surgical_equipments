import { createClient } from '@/utils/supabase/server';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/format'; // I'll need to create this or use a simple one
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch count of products
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  // Fetch count of orders
  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Fetch count of customers
  const { count: customerCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Fetch total revenue (sum of total_amount from orders)
  const { data: revenueData } = await supabase.from('orders').select('total_amount');

  const totalRevenue = revenueData?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(
      `
      *,
      profiles (
        full_name,
        email
      )
    `,
    )
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch products with low stock (e.g., < 10)
  const { data: lowStockProducts } = await supabase
    .from('products')
    .select('id, name, stock_quantity')
    .lt('stock_quantity', 10)
    .order('stock_quantity', { ascending: true })
    .limit(5);

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Total Orders',
      value: orderCount || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Active Products',
      value: productCount || 0,
      icon: Package,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'Total Customers',
      value: customerCount || 0,
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back. Here is what is happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-slate-200/60 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
                  {stat.label}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-slate-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders" className="text-xs font-bold text-primary">
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {order.profiles?.full_name || 'Anonymous'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          ID: #{order.id.slice(0, 8)} •{' '}
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        ₹{Number(order.total_amount).toLocaleString()}
                      </div>
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full inline-block ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-600'
                            : order.status === 'pending'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
                  <div className="p-4 bg-slate-50 rounded-full">
                    <Clock className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium">No recent orders found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Low Stock */}
        <div className="space-y-8">
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-3 rounded-xl h-11" asChild>
                <Link href="/admin/products/new">
                  <Package className="w-4 h-4" />
                  Add New Product
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 rounded-xl h-11"
                asChild
              >
                <Link href="/admin/orders">
                  <ShoppingCart className="w-4 h-4" />
                  Manage Orders
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-sm">
                {lowStockProducts && lowStockProducts.length > 0 ? (
                  lowStockProducts.map((product) => (
                    <div key={product.id} className="p-4 flex items-center justify-between">
                      <span className="font-medium text-slate-700">{product.name}</span>
                      <span
                        className={`font-black ${product.stock_quantity === 0 ? 'text-red-600' : 'text-amber-600'}`}
                      >
                        {product.stock_quantity} left
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    All inventory healthy
                  </div>
                )}
                <div className="p-4 text-center">
                  <Link
                    href="/admin/products"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View All Inventory
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
