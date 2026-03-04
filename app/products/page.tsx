import { createClient } from '@/utils/supabase/server';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductSort } from '@/components/products/product-sort';
import { Suspense } from 'react';

export const metadata = {
  title: 'Products - Surgical & Physiotherapy Store',
  description: 'Browse our full catalog of medical and therapeutic equipment.',
};

interface SearchParams {
  category?: string;
  min_price?: string;
  max_price?: string;
  in_stock?: string;
  sort?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // 1. Fetch Categories for Filter Sidebar
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  // 2. Build Product Query
  let query = supabase.from('products').select(`
            *,
            categories (
                name
            )
        `);

  // Applying Filters
  if (params.category) {
    const categorySlugs = params.category.split(',');
    // Fetch category IDs first to filter products
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .in('slug', categorySlugs);

    if (catData) {
      query = query.in(
        'category_id',
        catData.map((c) => c.id),
      );
    }
  }

  if (params.min_price) {
    query = query.gte('price', parseFloat(params.min_price));
  }

  if (params.max_price) {
    query = query.lte('price', parseFloat(params.max_price));
  }

  if (params.in_stock === 'true') {
    query = query.gt('stock_quantity', 0);
  }

  // Applying Sort
  const sort = params.sort || 'newest';
  if (sort === 'price-asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price-desc') {
    query = query.order('price', { ascending: false });
  } else if (sort === 'featured') {
    query = query.order('is_featured', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data: products, error } = await query;

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Our Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Displaying {products?.length || 0} high-quality medical products.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Sort By:</span>
          <ProductSort />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <Suspense fallback={<div className="h-96 w-full animate-pulse bg-muted rounded-xl" />}>
            <ProductFilters categories={categories || []} />
          </Suspense>
        </aside>

        {/* Main Product Grid */}
        <main className="flex-1">
          {error ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-destructive bg-destructive/5">
              Error loading products: {error.message}
            </div>
          ) : products?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 rounded-xl border border-dashed bg-muted/20">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters to find what you are looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
