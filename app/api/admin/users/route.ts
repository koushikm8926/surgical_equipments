import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { type Customer, type ShippingAddress } from '@/types/admin';

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

    // Fetch all non-admin profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'admin')
      .order('created_at', { ascending: false });

    if (profilesError) throw profilesError;

    // Fetch all orders (including guests)
    const { data: orders } = await supabase
      .from('orders')
      .select('user_id, total_amount, shipping_address, created_at')
      .neq('status', 'cancelled');

    // Combined Customer Storage
    const customerMap = new Map<string, Customer>();

    // 1. Initialize from Profiles
    (profiles || []).forEach((p) => {
      customerMap.set(p.id, {
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        created_at: p.created_at,
        updated_at: p.updated_at,
        role: p.role,
        total_orders: 0,
        total_spend: 0,
        is_guest: false,
      });
    });

    // 2. Aggregate Orders and Add Guests
    (orders || []).forEach((order) => {
      const shipping = order.shipping_address as unknown as ShippingAddress;
      const phone = shipping?.phone;
      const customerKey = order.user_id || `guest_${phone}`;

      if (!customerMap.has(customerKey)) {
        // Create Guest Record
        customerMap.set(customerKey, {
          id: customerKey,
          full_name: shipping?.full_name || 'Anonymous Guest',
          email: 'Guest Customer',
          created_at: order.created_at,
          updated_at: order.created_at,
          role: 'guest',
          total_orders: 0,
          total_spend: 0,
          is_guest: true,
        });
      }

      const c = customerMap.get(customerKey)!;
      c.total_orders += 1;
      c.total_spend += Number(order.total_amount);
    });

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return NextResponse.json(customers);
  } catch (error: unknown) {
    console.error('API Error /api/admin/users:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
