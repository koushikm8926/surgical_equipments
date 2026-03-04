import { createClient } from '@/utils/supabase/server';
import { ProductCard } from '@/components/products/product-card';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q;
  return {
    title: q ? `Search results for "${q}" - SurgicalStore` : 'Search Products',
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q;
  const supabase = await createClient();

  if (!q) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Please enter a search term</h1>
      </div>
    );
  }

  // Supabase Full-Text Search on 'name' and 'description'
  const { data: products, error } = await supabase
    .from('products')
    .select(
      `
            *,
            categories (
                name
            )
        `,
    )
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
    .order('is_featured', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Search Results</h1>
      <p className="text-muted-foreground mb-8">
        {products?.length || 0} results found for{' '}
        <span className="font-semibold text-foreground">&quot;{q}&quot;</span>
      </p>

      {error ? (
        <div className="p-8 text-center text-destructive bg-destructive/5 rounded-xl border border-dashed">
          Error performing search: {error.message}
        </div>
      ) : products?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border border-dashed">
          <p className="text-xl font-medium">No matches found</p>
          <p className="text-muted-foreground mt-2">
            Try different keywords or browse our categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
