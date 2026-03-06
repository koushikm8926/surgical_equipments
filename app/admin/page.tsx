'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, Clock, CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import { SalesChart } from '@/components/admin/chart-sales';
import { OrderTable } from '@/components/admin/order-table';
import { formatPrice } from '@/utils/format';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { type AdminStats } from '@/types/admin';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success('Fulfillment status adjusted');
      fetchDashboardData();
    } catch {
      toast.error('Operational error: Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">
          Booting Admin Core...
        </p>
      </div>
    );
  }

  if (!stats)
    return (
      <div className="p-12 text-center bg-red-50 border border-red-100 rounded-3xl text-red-600 font-bold">
        Critical System Failure: Unable to retrieve analytics
      </div>
    );

  const chartData = stats.salesTrend.map((t) => ({
    date: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: Number(t.total_amount),
  }));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 mt-2 font-medium bg-slate-100 w-fit px-3 py-1 rounded-full text-xs">
            Live Analytics & Global Fulfillment Monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-2xl border-slate-200 shadow-sm font-bold text-xs px-6"
            onClick={fetchDashboardData}
          >
            Refresh Data
          </Button>
          <Button
            className="rounded-2xl shadow-lg shadow-primary/20 font-bold text-xs px-6"
            asChild
          >
            <Link href="/admin/orders">Fulfillment Center</Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Gross Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={TrendingUp}
          trend={{ value: '18.4%', isPositive: true }}
          className="lg:col-span-1"
        />
        <StatCard label="Transaction Count" value={stats.orderCount} icon={ShoppingBag} />
        <StatCard
          label="Active Fulfillment"
          value={(stats.statusCounts.processing || 0) + (stats.statusCounts.shipped || 0)}
          icon={Clock}
          className="border-blue-100 bg-blue-50/20"
        />
        <StatCard
          label="Delivered Units"
          value={stats.statusCounts.delivered || 0}
          icon={CheckCircle2}
          className="border-emerald-100 bg-emerald-50/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-black text-slate-900 text-lg">Revenue Performance</h2>
                <p className="text-slate-400 text-xs font-medium">Daily transaction volume (USD)</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Live Trend
                </span>
              </div>
            </div>
            <div className="h-[280px]">
              <SalesChart data={chartData} height={280} />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h2 className="font-black text-slate-900 text-lg">Recent Transactions</h2>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-primary hover:bg-primary/5 rounded-xl font-bold"
              >
                <Link href="/admin/orders">
                  All Activity <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <OrderTable orders={stats.recentOrders} onUpdateStatus={handleUpdateStatus} />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
            <div className="relative z-10">
              <Package className="w-10 h-10 text-primary mb-6" />
              <h2 className="font-black text-xl leading-tight">Operational Alert</h2>
              <p className="text-slate-400 text-xs mt-2 mb-6 font-medium leading-relaxed">
                Critical stocks detected for &quot;Surgical Scalpel Set&quot; and &quot;N95
                Respirators&quot;. Immediate procurement required.
              </p>
              <Button
                variant="secondary"
                className="w-full rounded-2xl font-black py-6 bg-white hover:bg-slate-100 text-slate-900 text-xs uppercase tracking-widest shadow-xl shadow-primary/10"
                asChild
              >
                <Link href="/admin/products">Resolve Inventory</Link>
              </Button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <h2 className="font-black text-slate-900 mb-6">Fulfillment Health</h2>
            <div className="space-y-6">
              {[
                {
                  label: 'Delivered',
                  count: stats.statusCounts.delivered || 0,
                  color: 'bg-emerald-500',
                },
                {
                  label: 'In Transit',
                  count: stats.statusCounts.shipped || 0,
                  color: 'bg-violet-500',
                },
                {
                  label: 'Processing',
                  count: stats.statusCounts.processing || 0,
                  color: 'bg-blue-500',
                },
                { label: 'Pending', count: stats.statusCounts.pending || 0, color: 'bg-amber-500' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">{item.label}</span>
                    <span className="font-black text-slate-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-1000`}
                      style={{ width: `${(item.count / stats.orderCount) * 100 || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                System healthy: All nodes synchronized
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
