'use client';

import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';
import { CartProduct } from '@/contexts/cart-context';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: CartProduct;
  variant?: 'icon' | 'full';
  className?: string;
}

export function AddToCartButton({ product, variant = 'full', className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (variant === 'icon') {
    return (
      <Button
        size="icon"
        variant="secondary"
        onClick={handleAdd}
        className={className}
        title="Add to Cart"
      >
        <Plus className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAdd}
      className={`gap-2 rounded-xl font-bold transition-all ${added ? 'bg-emerald-600 hover:bg-emerald-600' : ''} ${className ?? ''}`}
    >
      <ShoppingCart className="w-4 h-4" />
      {added ? 'Added!' : 'Add to Cart'}
    </Button>
  );
}
