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

    // Fetch stats
    // 1. Total Revenue
    const { data: revenueData } = await supabase
      .from('orders')
      .select('total_amount')
      .neq('status', 'cancelled');

    const totalRevenue =
      revenueData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

    // 2. Order counts by status
    const { data: statusData } = await supabase.from('orders').select('status');

    const statusCounts = (statusData || []).reduce((acc: Record<string, number>, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // 3. Recent orders
    const { data: recentOrdersData } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at, profiles(full_name), order_items(id)')
      .order('created_at', { ascending: false })
      .limit(5);

    const recentOrders = (recentOrdersData || []).map((order) => ({
      ...order,
      order_items: [{ count: order.order_items?.length || 0 }],
    }));

    // 4. Sales over time (Simplified: last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: salesTrend } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
      .neq('status', 'cancelled')
      .order('created_at', { ascending: true });

    const orderCount = statusData?.length || 0;

    // Final return
    return NextResponse.json({
      totalRevenue,
      orderCount,
      averageOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
      statusCounts,
      recentOrders,
      salesTrend: salesTrend || [],
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
