'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type ActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function updateProfile(prevState: ActionState, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authorized' };
  }

  const updates = {
    id: user.id,
    full_name: formData.get('full_name') as string,
    phone: formData.get('phone') as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('profiles').upsert(updates);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/account');
  return { success: true };
}

export async function updatePassword(prevState: ActionState, formData: FormData) {
  const supabase = await createClient();

  const new_password = formData.get('new_password') as string;
  const confirm_password = formData.get('confirm_password') as string;

  if (new_password !== confirm_password) {
    return { error: 'Passwords do not match.' };
  }

  const { error } = await supabase.auth.updateUser({
    password: new_password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/account/security');
  return { success: true };
}
