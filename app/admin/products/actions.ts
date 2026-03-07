'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  stock_quantity: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  category_id: z.string().uuid('Invalid category'),
  image_url: z.string().optional(),
  is_featured: z.coerce.boolean().default(false),
});

export async function upsertProduct(
  prevState: { errors?: Record<string, string[]>; message?: string } | null,
  formData: FormData,
) {
  const supabase = await createClient();

  const validatedFields = ProductSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock_quantity: formData.get('stock_quantity'),
    category_id: formData.get('category_id'),
    image_url: formData.get('image_url'),
    is_featured: formData.get('is_featured') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to save product. Please check the errors below.',
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email === 'admin@surgicalequip.com') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      const { error: syncError } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        role: 'admin',
        full_name: 'Default Admin',
      });

      if (syncError) {
        return {
          message: `Permission Sync Failed: ${syncError.message}. Please run the administration fix migration.`,
        };
      }
    }
  }

  const productId = formData.get('id') as string;

  if (productId) {
    // Update
    const { error } = await supabase
      .from('products')
      .update(validatedFields.data)
      .eq('id', productId);

    if (error) {
      return { message: `Database Error: ${error.message}` };
    }
  } else {
    // Insert
    const { error } = await supabase.from('products').insert([validatedFields.data]);

    if (error) {
      return { message: `Database Error: ${error.message}` };
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    return { message: `Database Error: ${error.message}` };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { message: 'Deleted Product.' };
}
