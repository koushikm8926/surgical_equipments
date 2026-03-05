import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ShoppingBag, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/utils/format';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  processing: 'bg-blue-50 text-blue-600 border-blue-100',
  shipped: 'bg-violet-50 text-violet-600 border-violet-100',
  delivered: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
};

export default async function AccountOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total_amount, created_at, order_items(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order History</h1>
        <p className="text-slate-500 text-sm mt-1">Track and manage your past orders.</p>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
          <div className="p-6 bg-slate-50 rounded-full">
            <ShoppingBag className="w-10 h-10 opacity-40" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-700 text-base">No orders yet</p>
            <p className="text-sm mt-1">Place your first order to see it here.</p>
          </div>
          <Button asChild className="rounded-xl gap-2 mt-2">
            <Link href="/products">
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const itemCount =
              (order.order_items as unknown as { count: number }[])?.[0]?.count ?? 0;
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary/5 transition-colors">
                      <ShoppingBag className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {formatDate(order.created_at)}
                        &nbsp;·&nbsp;
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant="outline"
                      className={`rounded-xl px-3 font-bold text-[10px] uppercase tracking-widest ${statusColors[order.status] ?? 'bg-slate-50 text-slate-600'}`}
                    >
                      {order.status}
                    </Badge>
                    <span className="font-black text-slate-900 text-sm">
                      {formatPrice(Number(order.total_amount))}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
