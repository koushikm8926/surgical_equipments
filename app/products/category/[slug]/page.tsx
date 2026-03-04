import { createClient } from '@/utils/supabase/server';
import { ProductCard } from '@/components/products/product-card';
import { notFound } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('slug', slug)
    .single();

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} - SurgicalStore`,
    description: `Browse our collection of ${category.name} medical equipment.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const supabase = await createClient();

  // 1. Fetch Category Info
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) {
    notFound();
  }

  // 2. Fetch Products in this category
  const { data: products } = await supabase
    .from('products')
    .select(
      `
            *,
            categories (
                name
            )
        `,
    )
    .eq('category_id', category.id)
    .order('is_featured', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-primary/5 rounded-3xl p-8 md:p-12 mb-12 border border-primary/10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{category.name}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">{category.description}</p>
      </div>

      {products?.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
          <p className="text-xl font-medium text-muted-foreground">
            No products available in this category yet.
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
