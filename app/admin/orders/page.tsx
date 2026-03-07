'use client';

import { useEffect, useState } from 'react';
import { Search, RefreshCw, ShoppingBag } from 'lucide-react';
import { OrderTable } from '@/components/admin/order-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { type Order } from '@/types/admin';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Query failure');
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error('Data acquisition error: Unable to sync with order database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Transaction rejected');

      toast.success(`Order state transitioned to ${newStatus.toUpperCase()}`);
      fetchOrders();
    } catch {
      toast.error('System error: Fulfillment transition failed');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = (
      order.profiles?.full_name ||
      order.shipping_address?.full_name ||
      ''
    ).toLowerCase();
    const customerEmail = (order.profiles?.email || 'Guest').toLowerCase();
    const orderId = order.id.toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      orderId.includes(term) || customerName.includes(term) || customerEmail.includes(term);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Fulfillment Center</h1>
          <p className="text-slate-500 mt-2 font-medium bg-slate-100 w-fit px-3 py-1 rounded-full text-xs">
            Operational Lifecycle & Lifecycle Management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-2xl border-slate-200 shadow-sm font-bold text-xs px-6"
            onClick={fetchOrders}
            disabled={loading}
          >
            <RefreshCw className={`w-3 h-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Sync Orders
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-2">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search by ID, Customer name or Email..."
              className="pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all py-6 text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap
                        ${
                          statusFilter === s
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                        }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-black text-slate-900 text-lg">Transaction Ledger</h2>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {filteredOrders.length} Transaction Records
          </div>
        </div>
        <OrderTable orders={filteredOrders} onUpdateStatus={updateStatus} loading={loading} />
      </div>
    </div>
  );
}
