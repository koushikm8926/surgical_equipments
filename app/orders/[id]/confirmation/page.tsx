import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { CheckCircle2, Package, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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

export default async function OrderConfirmationPage({ params }: { params: { id: string } }) {
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
    .eq('user_id', user.id) // Security: only owner can view
    .single();

  if (!order) return notFound();

  const address = order.shipping_address as unknown as ShippingAddress;
  const items = order.order_items as OrderItem[];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4 ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Order Confirmed!</h1>
          <p className="text-slate-500 mt-2 text-base">
            Thank you for your order. We&apos;ll start processing it right away.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm font-bold text-slate-600">
            Order #{order.id.slice(0, 8).toUpperCase()}
            &nbsp;·&nbsp;
            {formatDate(order.created_at)}
          </div>
        </div>

        <div className="space-y-5">
          {/* Order Items */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <Package className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-sm text-slate-700 uppercase tracking-widest">
                Items Ordered
              </h2>
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
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
              <div className="flex justify-between font-black text-slate-900">
                <span>Order Total</span>
                <span className="text-lg">{formatPrice(Number(order.total_amount))}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-sm text-slate-700 uppercase tracking-widest">
                Delivery To
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

          {/* Status */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
            <p className="text-sm font-medium text-slate-600">
              We&apos;ll send an update when your order ships. Estimated delivery:{' '}
              <strong>3–7 business days</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 h-12 rounded-xl font-bold gap-2">
              <Link href="/account/orders">
                View Order History <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 h-12 rounded-xl font-bold">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
