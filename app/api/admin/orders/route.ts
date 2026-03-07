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
    const { data: orders, error } = await supabase
      .from('orders')
      .select(
        'id,user_id,status,total_amount,shipping_address,created_at,updated_at,profiles(full_name,email),order_items(id)',
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map order_items to the format expected by the frontend: [{ count: number }]
    const formattedOrders = (orders || []).map((order) => ({
      ...order,
      order_items: [{ count: order.order_items?.length || 0 }],
    }));

    return NextResponse.json(formattedOrders);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
