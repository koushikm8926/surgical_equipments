import { createClient } from '@/utils/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { ChevronLeft, Package, User, MapPin, CheckCircle2, Clock, Truck, Home } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/utils/format';
import Image from 'next/image';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_time: number;
  products: { name: string; image_url: string | null } | null;
}

interface ShippingAddress {
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  processing: 'bg-blue-50 text-blue-600 border-blue-100',
  shipped: 'bg-violet-50 text-violet-600 border-violet-100',
  delivered: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
};

export default async function AccountOrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: order } = await supabase
    .from('orders')
    .select(`*, order_items(*, products(name, image_url))`)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!order) return notFound();

  const address = order.shipping_address as unknown as ShippingAddress;
  const items = order.order_items as OrderItem[];
  const currentStatusIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <Badge
            variant="outline"
            className={`rounded-xl px-3 font-bold text-[10px] uppercase tracking-widest ${statusColors[order.status] ?? ''}`}
          >
            {order.status}
          </Badge>
        </div>
        <p className="text-sm text-slate-500 mt-1">Placed on {formatDate(order.created_at)}</p>
      </div>

      {/* Status Timeline (hidden for cancelled orders) */}
      {order.status !== 'cancelled' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, i) => {
              const done = currentStatusIdx >= i;
              const active = currentStatusIdx === i;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center gap-2 relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                      done ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                    } ${active ? 'ring-4 ring-primary/20' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${done ? 'text-primary' : 'text-slate-400'}`}
                  >
                    {step.label}
                  </span>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`absolute top-5 left-[55%] right-[-50%] h-0.5 -translate-y-1/2 ${done && currentStatusIdx > i ? 'bg-primary' : 'bg-slate-200'}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <Package className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-sm text-slate-700 uppercase tracking-widest">Items</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-5">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                <Image
                  src={item.products?.image_url || '/placeholder_product.png'}
                  alt={item.products?.name || 'Product'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{item.products?.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Qty: {item.quantity} × {formatPrice(item.price_at_time)}
                </p>
              </div>
              <span className="font-black text-slate-900 text-sm">
                {formatPrice(item.price_at_time * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between font-black text-slate-900">
          <span>Order Total</span>
          <span className="text-lg">{formatPrice(Number(order.total_amount))}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-sm text-slate-700 uppercase tracking-widest">
            Delivery Address
          </h2>
        </div>
        <div className="text-sm text-slate-600 space-y-0.5">
          <p className="font-bold text-slate-900">{address?.full_name}</p>
          <p>{address?.street_address}</p>
          <p>
            {address?.city}, {address?.state} – {address?.postal_code}
          </p>
          <p className="font-medium pt-1">{address?.phone}</p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-slate-500">
          Need help?{' '}
          <Link href="/contact" className="font-bold text-primary hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
