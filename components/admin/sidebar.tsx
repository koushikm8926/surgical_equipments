'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/users', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-100 mb-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          SurgicalStore
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200 border border-transparent',
                isActive
                  ? 'bg-primary/5 text-primary border-primary/10 font-bold shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600',
                  )}
                />
                <span className="text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Exit Admin</span>
        </Button>
      </div>
    </aside>
  );
}
