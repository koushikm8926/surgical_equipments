import { createClient } from '@/utils/supabase/server';
import { ProductForm } from '../product-form';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ]);

  if (!product) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Inventory
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Product</h1>
        <p className="text-slate-500 text-sm mt-1">
          Update the details for <span className="text-slate-900 font-bold">{product.name}</span>.
        </p>
      </div>

      <ProductForm initialData={product} categories={categories || []} />
    </div>
  );
}
