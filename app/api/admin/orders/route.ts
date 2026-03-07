import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Verify admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    // Sync admin role for the demo user if missing or not set to admin
    if (user.email === 'admin@surgicalequip.com' && profile?.role !== 'admin') {
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        role: 'admin',
        full_name: profile?.full_name || 'Default Admin',
      });
    } else if (profile?.role !== 'admin' && user.email !== 'admin@surgicalequip.com') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all orders with profiles and order item counts
    console.log('Fetching admin orders for user:', user.email);
    const { data: orders, error } = await supabase
      .from('orders')
      .select(
        'id,user_id,status,total_amount,shipping_address,created_at,updated_at,profiles(full_name,email),order_items(id)',
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Query Error /api/admin/orders:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    console.log(`Successfully fetched ${orders?.length || 0} orders`);

    // Map result to expected format
    const formattedOrders = (orders || []).map((order) => ({
      ...order,
      order_items: [
        { count: (order as { order_items?: { id: string }[] }).order_items?.length || 0 },
      ],
    }));

    return NextResponse.json(formattedOrders);
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('API Error /api/admin/orders:', err);
    return NextResponse.json(
      { error: err?.message || 'Unknown error', details: error },
      { status: 500 },
    );
  }
}
