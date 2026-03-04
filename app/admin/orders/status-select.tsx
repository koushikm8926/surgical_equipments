'use client';

import { useState } from 'react';
import { updateOrderStatus } from './actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.message.includes('Error')) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue={currentStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
        <SelectTrigger className="w-[180px] h-10 rounded-xl font-bold text-xs uppercase tracking-wider">
          <SelectValue placeholder="Update Status" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-200">
          <SelectItem value="pending" className="text-amber-600 font-bold">
            PENDING
          </SelectItem>
          <SelectItem value="processing" className="text-blue-600 font-bold">
            PROCESSING
          </SelectItem>
          <SelectItem value="shipped" className="text-violet-600 font-bold">
            SHIPPED
          </SelectItem>
          <SelectItem value="delivered" className="text-emerald-600 font-bold">
            DELIVERED
          </SelectItem>
          <SelectItem value="cancelled" className="text-red-600 font-bold">
            CANCELLED
          </SelectItem>
        </SelectContent>
      </Select>
      {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
    </div>
  );
}
