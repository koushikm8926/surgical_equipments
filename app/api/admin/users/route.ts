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
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && user.email !== 'admin@surgicalequip.com') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all non-admin profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'admin')
      .order('created_at', { ascending: false });

    if (profilesError) throw profilesError;

    // Fetch order summaries per user
    const { data: orders } = await supabase
      .from('orders')
      .select('user_id, total_amount')
      .neq('status', 'cancelled');

    // Aggregate order data per user
    const orderMap: Record<string, { count: number; spend: number }> = {};
    (orders || []).forEach((order) => {
      if (!order.user_id) return;
      if (!orderMap[order.user_id]) {
        orderMap[order.user_id] = { count: 0, spend: 0 };
      }
      orderMap[order.user_id].count += 1;
      orderMap[order.user_id].spend += Number(order.total_amount);
    });

    // Merge profiles with order data
    const customers = (profiles || []).map((p) => ({
      ...p,
      total_orders: orderMap[p.id]?.count || 0,
      total_spend: orderMap[p.id]?.spend || 0,
    }));

    return NextResponse.json(customers);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
