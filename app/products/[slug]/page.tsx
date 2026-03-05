import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/products/product-card';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { QuoteRequestButton } from '@/components/products/quote-request-button';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .single();

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} - SurgicalStore`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const supabase = await createClient();

  // 1. Fetch Product Data
  const { data: product } = await supabase
    .from('products')
    .select(
      `
            *,
            categories (
                id,
                name,
                slug
            )
        `,
    )
    .eq('slug', slug)
    .single();

  if (!product) {
    notFound();
  }

  // 2. Fetch Related Products (same category, different ID)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select(
      `
            *,
            categories (
                name
            )
        `,
    )
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(3);

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted ring-1 ring-border">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-secondary">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{product.categories?.name}</Badge>
            {product.is_featured && (
              <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                Featured
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-4">{product.name}</h1>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-bold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">Incl. all taxes</span>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-4 py-2 border-y">
              <div className="flex items-center gap-2">
                <span
                  className={product.stock_quantity > 0 ? 'text-green-600' : 'text-destructive'}
                >
                  ●
                </span>
                <span className="text-sm font-medium">
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} available in stock`
                    : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image_url: product.image_url,
              }}
              className="flex-1 h-12 text-base"
            />
            <QuoteRequestButton productId={product.id} productName={product.name} />
          </div>

          {/* Features/Trust Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-8">
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/30">
              <ShieldCheck className="h-6 w-6 text-primary mb-2" />
              <span className="text-xs font-semibold">1 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/30">
              <Truck className="h-6 w-6 text-primary mb-2" />
              <span className="text-xs font-semibold">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/30">
              <RefreshCw className="h-6 w-6 text-primary mb-2" />
              <span className="text-xs font-semibold">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="border-t pt-16">
          <h2 className="text-2xl font-bold mb-8">Related Equipment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
