import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-primary/5 rounded-xl">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-bold px-2 py-1 rounded-full',
              trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600',
            )}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
      </div>
    </div>
  );
}
