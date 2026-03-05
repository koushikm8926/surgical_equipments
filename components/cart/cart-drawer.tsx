'use client';

import { useCart } from '@/contexts/cart-context';
import { CartItemRow } from './cart-item';
import { Button } from '@/components/ui/button';
import { X, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
}

export function CartDrawer() {
  const { items, isOpen, closeCart, clearCart, subtotal, totalItems } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Your Cart</h2>
              <p className="text-xs text-slate-500 font-medium">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400 py-16">
              <div className="p-6 bg-slate-50 rounded-full">
                <ShoppingCart className="w-10 h-10 opacity-40" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-700 text-base">Your cart is empty</p>
                <p className="text-sm mt-1">Add some equipment to get started.</p>
              </div>
              <Button asChild className="rounded-xl gap-2" onClick={closeCart}>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="py-2">
              {items.map((item) => (
                <CartItemRow key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 p-6 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">GST (18%)</span>
                <span className="font-bold">{formatPrice(gst)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Shipping</span>
                <span className="font-bold text-emerald-600 uppercase text-xs tracking-widest">
                  Free
                </span>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex justify-between text-slate-900">
                <span className="font-black text-base">Total</span>
                <span className="font-black text-base">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-xl font-bold text-base gap-2 shadow-lg shadow-primary/20"
              asChild
              onClick={closeCart}
            >
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-slate-500 font-medium hover:text-primary transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
