'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('orders').update({ status }).eq('id', id);

  if (error) {
    return { message: 'Database Error: Failed to Update Order Status.' };
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  return { message: 'Order status updated successfully.' };
}
