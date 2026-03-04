import { createClient } from '@/utils/supabase/server';
import {
  ChevronLeft,
  MapPin,
  Package,
  User,
  Mail,
  Phone,
  Calendar,
  IndianRupee,
  Printer,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPrice, formatDate } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusSelect } from '../status-select';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface ShippingAddress {
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

interface OrderItem {
  id: string;
  price_at_time: number;
  quantity: number;
  products: {
    name: string;
    image_url: string | null;
  } | null;
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from('orders')
    .select(
      `
      *,
      profiles (
        full_name,
        email,
        phone
      ),
      order_items (
        *,
        products (
          name,
          image_url,
          price
        )
      )
    `,
    )
    .eq('id', id)
    .single();

  if (!order) {
    return notFound();
  }

  const address = order.shipping_address as unknown as ShippingAddress;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Order #{order.id.slice(0, 8)}
            </h1>
            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
          </div>
          <p className="text-slate-500 text-sm mt-1">Placed on {formatDate(order.created_at)}</p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl h-11 gap-2 font-bold text-sm bg-white border-slate-200"
        >
          <Printer className="w-4 h-4" />
          Print Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Order Items ({order.order_items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {order.order_items.map((item: OrderItem) => (
                  <div
                    key={item.id}
                    className="p-6 flex items-start gap-4 hover:bg-slate-50/30 transition-colors"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                      <Image
                        src={item.products?.image_url || '/placeholder_product.png'}
                        alt={item.products?.name || 'Product Image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 leading-tight mb-1">
                        {item.products?.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium mb-2">
                        Price at purchase: {formatPrice(item.price_at_time)}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-700">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm font-black text-slate-900">
                          {formatPrice(item.price_at_time * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="text-slate-700 font-bold">{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Shipping</span>
                <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest">
                  Free
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-900 font-black uppercase tracking-widest text-xs">
                  Total Amount
                </span>
                <span className="text-xl font-black text-slate-900">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Customer & Shipping Details */}
        <div className="space-y-6">
          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {order.profiles?.full_name || 'Anonymous User'}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                  <Mail className="w-3 h-3" />
                  {order.profiles?.email}
                </div>
                {order.profiles?.phone && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                    <Phone className="w-3 h-3" />
                    {order.profiles.phone}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl h-10 font-bold text-xs"
                asChild
              >
                <Link href={`/admin/customers/${order.user_id}`}>View Customer Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="font-bold text-slate-900 mb-2 truncate">{address.full_name}</div>
              <div className="text-slate-500 space-y-1 leading-relaxed">
                <p>{address.street_address}</p>
                <p>
                  {address.city}, {address.state} {address.postal_code}
                </p>
                <p>{address.country}</p>
                <p className="pt-2 flex items-center gap-2 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {address.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Method</span>
                <span className="text-slate-900 font-bold uppercase tracking-widest">
                  Pay-on-Delivery
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Payment Status</span>
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-600 border-amber-100 font-black text-[9px] px-2 py-0"
                >
                  PENDING
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
