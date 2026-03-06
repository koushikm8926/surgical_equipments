import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  categories?: {
    name: string;
  };
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg">
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-secondary">
            No Image
          </div>
        )}
      </Link>
      <CardHeader className="p-4 bg-card">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
            {product.categories?.name || 'General'}
          </Badge>
          {product.stock_quantity > 0 ? (
            <span className="text-[10px] text-green-600 font-medium whitespace-nowrap">
              In Stock
            </span>
          ) : (
            <span className="text-[10px] text-destructive font-medium whitespace-nowrap">
              Out of Stock
            </span>
          )}
        </div>
        <CardTitle className="line-clamp-1 text-base mt-2">
          <Link href={`/products/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 flex items-center justify-between border-t bg-muted/20">
        <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image_url: product.image_url ?? null,
          }}
          variant="icon"
          className="h-10 w-10"
        />
      </CardFooter>
    </Card>
  );
}
