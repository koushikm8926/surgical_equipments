'use client';

import { CartItem as CartItemType } from '@/contexts/cart-context';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
}

export function CartItemRow({ item }: CartItemProps) {
  const { removeItem, updateQty } = useCart();

  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
        <Image
          src={item.product.image_url || '/placeholder_product.png'}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
          {item.product.name}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{formatPrice(item.product.price)} / unit</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-lg hover:bg-white"
              onClick={() => updateQty(item.product.id, item.quantity - 1)}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-lg hover:bg-white"
              onClick={() => updateQty(item.product.id, item.quantity + 1)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-slate-900">
              {formatPrice(item.product.price * item.quantity)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              onClick={() => removeItem(item.product.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
