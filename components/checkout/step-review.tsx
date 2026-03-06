'use client';

import { CartItem } from '@/contexts/cart-context';
import { ShippingAddress } from './step-shipping';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, MapPin, Package } from 'lucide-react';

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
}

interface Props {
  items: CartItem[];
  address: ShippingAddress;
  onNext: (isDemo?: boolean) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function StepReview({ items, address, onNext, onBack, isLoading }: Props) {
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 text-primary rounded-xl">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Order Review</h2>
          <p className="text-sm text-slate-500">Confirm your items and address before payment.</p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-sm text-slate-700 uppercase tracking-widest">
            Items ({items.length})
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-4 p-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                <Image
                  src={item.product.image_url || '/placeholder_product.png'}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.product.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Qty: {item.quantity} × {formatPrice(item.product.price)}
                </p>
              </div>
              <span className="font-black text-slate-900 text-sm shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-bold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>GST (18%)</span>
            <span className="font-bold">{formatPrice(gst)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Shipping</span>
            <span className="font-bold text-emerald-600">Free</span>
          </div>
          <div className="h-px bg-slate-200" />
          <div className="flex justify-between font-black text-slate-900">
            <span>Total</span>
            <span className="text-lg">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-slate-700 uppercase tracking-widest">
            Delivery Address
          </h3>
        </div>
        <div className="text-sm text-slate-600 space-y-0.5">
          <p className="font-bold text-slate-900">{address.full_name}</p>
          <p>{address.street_address}</p>
          <p>
            {address.city}, {address.state} – {address.postal_code}
          </p>
          <p>{address.country}</p>
          <p className="pt-1 font-medium">{address.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-12 rounded-xl font-bold gap-2 order-3 md:order-none md:col-span-2"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shipping
        </Button>
        <Button
          variant="secondary"
          className="h-12 rounded-xl font-bold gap-2 border-2 border-primary/20 hover:bg-primary/5 text-primary"
          onClick={() => onNext(true)}
          disabled={isLoading}
        >
          Demo Pay (Instant)
        </Button>
        <Button
          className="h-12 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
          onClick={() => onNext(false)}
          disabled={isLoading}
        >
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              Proceed to Stripe <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
