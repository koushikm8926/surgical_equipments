'use client';

import { useEffect, useState } from 'react';
import { Search, RefreshCw, Users, ShoppingBag, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatPrice, formatDate } from '@/utils/format';
import { type Customer } from '@/types/admin';

export default function AdminUsersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCustomers(data);
    } catch {
      toast.error('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return c.full_name?.toLowerCase().includes(term) || c.email?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Customer Directory</h1>
          <p className="text-slate-500 mt-2 font-medium bg-slate-100 w-fit px-3 py-1 rounded-full text-xs">
            Registered Users &amp; Purchase Analytics
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-2xl border-slate-200 shadow-sm font-bold text-xs px-6"
          onClick={fetchCustomers}
          disabled={loading}
        >
          <RefreshCw className={`w-3 h-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Sync Customers
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search by name or email..."
            className="pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all py-6 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-black text-slate-900 text-lg">Customer Profiles</h2>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {filtered.length} Records
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="font-medium animate-pulse text-sm">Fetching customer database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-400 border-2 border-dashed border-slate-100 m-6 rounded-3xl">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-bold text-slate-600">No customers found</p>
            <p className="text-sm mt-1">Try adjusting your search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-[13px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-widest text-[10px]">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4">Total Spend</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-violet-100 flex items-center justify-center text-primary font-black text-sm shrink-0">
                          {customer.full_name
                            ? customer.full_name.charAt(0).toUpperCase()
                            : customer.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 leading-tight">
                            {customer.full_name || 'Unnamed User'}
                          </span>
                          <span className="text-slate-400 text-[11px] font-mono">
                            UID: {customer.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-sm">{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(customer.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-black text-slate-900">{customer.total_orders}</span>
                        <span className="text-slate-400 text-[11px] font-medium">
                          {customer.total_orders === 1 ? 'order' : 'orders'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-black text-slate-900">
                        {formatPrice(customer.total_spend)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="outline"
                        className={`rounded-xl px-2.5 font-bold text-[10px] uppercase tracking-wider ${
                          customer.total_orders > 0
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}
                      >
                        {customer.total_orders > 0 ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-slate-500 font-medium">
          Total Customers: <span className="text-slate-800 font-bold">{customers.length}</span>
        </p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Directory synchronized
        </p>
      </div>
    </div>
  );
}
