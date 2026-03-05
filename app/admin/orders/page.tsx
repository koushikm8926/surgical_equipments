import { createClient } from '@/utils/supabase/server';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  Clock,
  Package,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatPrice } from '@/utils/format';

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
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
    .order('created_at', { ascending: false });

  // Fetch pending count
  const { count: pendingCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Fetch processing count
  const { count: processingCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'processing');

  // Fetch today's revenue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: todayRevenueData } = await supabase
    .from('orders')
    .select('total_amount')
    .gte('created_at', today.toISOString());

  const todayRevenue =
    todayRevenueData?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'processing':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'shipped':
        return 'bg-violet-50 text-violet-600 border-violet-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order Management</h1>
        <p className="text-slate-500 text-sm mt-1">
          Track and manage customer orders across all regions.
        </p>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest text-[10px]">
              Pending
            </div>
            <div className="text-xl font-bold text-slate-900">
              {String(pendingCount).padStart(2, '0')} Orders
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest text-[10px]">
              Processing
            </div>
            <div className="text-xl font-bold text-slate-900">
              {String(processingCount).padStart(2, '0')} Orders
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest text-[10px]">
              Today Revenue
            </div>
            <div className="text-xl font-bold text-slate-900">₹{todayRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by order ID or customer name..."
            className="pl-10 h-11 rounded-xl bg-white border-slate-200"
          />
        </div>
        <Button
          variant="outline"
          className="h-11 rounded-xl gap-2 px-4 bg-white border-slate-200 font-bold text-sm"
        >
          <Filter className="w-4 h-4 text-slate-500" />
          Filter Status
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">
                Order ID
              </TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">
                Customer
              </TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">
                Date
              </TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">
                Total Amount
              </TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">
                Status
              </TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell>
                    <span className="font-black text-slate-900 text-sm">
                      #{order.id.slice(0, 8)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm">
                        {order.profiles?.full_name || 'Anonymous'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium lowercase italic">
                        {order.profiles?.email || 'No email provided'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600 font-medium text-xs">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-slate-900 text-sm">
                      {formatPrice(order.total_amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`rounded-xl px-2.5 font-bold text-[10px] uppercase tracking-widest ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-slate-100"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-xl p-1 shadow-xl border-slate-200"
                      >
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 px-3 py-2 font-bold">
                          Manage Order
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          className="rounded-lg px-3 py-2 text-sm font-medium gap-2 cursor-pointer"
                          asChild
                        >
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium gap-2 cursor-pointer">
                          <Package className="w-3.5 h-3.5 text-slate-400" />
                          Mark as Shipped
                        </DropdownMenuItem>
                        <div className="h-px bg-slate-100 my-1" />
                        <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium gap-2 text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <ShoppingCart className="w-10 h-10 opacity-20" />
                    <p className="font-medium text-sm">No orders have been placed yet.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
