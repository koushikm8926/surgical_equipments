import { createClient } from '@/utils/supabase/server';
import { ProductForm } from '../product-form';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewProductPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase.from('categories').select('*').order('name');

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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Equipment</h1>
        <p className="text-slate-500 text-sm mt-1">
          Fill in the details to list a new medical instrument or tool.
        </p>
      </div>

      <ProductForm categories={categories || []} />
    </div>
  );
}
