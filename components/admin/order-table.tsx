'use client';

import React from 'react';
import {
  ShoppingBag,
  User,
  MoreHorizontal,
  Mail,
  Package,
  CheckCircle,
  Truck,
  XCircle,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/utils/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { type Order } from '@/types/admin';

export const statusMap = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    icon: Package,
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    icon: CheckCircle,
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    icon: CheckCircle,
  },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-600 border-red-100', icon: XCircle },
};

interface OrderTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: string) => void;
  loading?: boolean;
}

export function OrderTable({ orders, onUpdateStatus, loading }: OrderTableProps) {
  if (loading) {
    return (
      <div className="px-6 py-12 text-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="font-medium animate-pulse text-sm">Syncing latest order data...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-slate-400 border-2 border-dashed border-slate-100 m-6 rounded-3xl">
        <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p className="font-bold text-slate-600">No matching orders found</p>
        <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto text-[13px]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-widest text-[10px]">
            <th className="px-6 py-4">Status & Order ID</th>
            <th className="px-6 py-4">Customer Details</th>
            <th className="px-6 py-4">Items & Valuation</th>
            <th className="px-6 py-4">Timestamp</th>
            <th className="px-6 py-4 text-right">Fulfillment</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => {
            const status = statusMap[order.status as keyof typeof statusMap] || statusMap.pending;
            const itemCount = order.order_items?.[0]?.count || 0;

            return (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${status.color.split(' ')[1]}`} />
                    <div className="flex flex-col">
                      <Badge
                        variant="outline"
                        className={`w-fit rounded-lg px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider mb-1 ${status.color}`}
                      >
                        {order.status}
                      </Badge>
                      <span className="font-black text-slate-900 font-mono tracking-tight">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 leading-tight">
                        {order.profiles?.full_name || 'Anonymous Guest'}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {order.profiles?.email || 'Guest Session'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-sm">
                      {formatPrice(Number(order.total_amount))}
                    </span>
                    <span className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1 font-medium">
                      <ShoppingBag className="w-3 h-3" />
                      {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-slate-500 font-medium">{formatDate(order.created_at)}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-xl hover:bg-slate-200/50 border border-transparent hover:border-slate-200"
                      >
                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 rounded-2xl p-2 border-slate-200 shadow-xl animate-in fade-in zoom-in duration-200"
                    >
                      <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 tracking-widest px-2 mb-1">
                        Deployment Action
                      </DropdownMenuLabel>
                      {Object.entries(statusMap).map(([key, value]) => (
                        <DropdownMenuItem
                          key={key}
                          className="gap-3 cursor-pointer rounded-xl py-2 px-3 text-sm font-medium focus:bg-primary/5 focus:text-primary transition-colors"
                          onClick={() => onUpdateStatus(order.id, key)}
                        >
                          <value.icon className="w-4 h-4 opacity-50" />
                          {value.label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator className="my-2 bg-slate-100" />
                      <DropdownMenuItem className="gap-3 text-slate-500 rounded-xl py-2 px-3 focus:bg-slate-50">
                        <Mail className="w-4 h-4 opacity-50" /> Update Customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
