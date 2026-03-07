'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, MapPin } from 'lucide-react';

const ShippingSchema = z.object({
  full_name: z.string().min(2, 'Full name required'),
  street_address: z.string().min(5, 'Street address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  postal_code: z.string().regex(/^\d{6}$/, 'Valid 6-digit PIN required'),
  country: z.string().min(1, 'Country required'),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Valid phone number required'),
});

export type ShippingAddress = z.infer<typeof ShippingSchema>;

interface Props {
  defaultValues?: Partial<ShippingAddress>;
  onNext: (data: ShippingAddress) => void;
}

export function StepShipping({ defaultValues, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingSchema),
    defaultValues: { country: 'India', ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 text-primary rounded-xl">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Shipping Address</h2>
          <p className="text-sm text-slate-500">Where should we deliver your order?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2 space-y-2">
          <Label
            htmlFor="full_name"
            className="font-bold text-xs uppercase tracking-wider text-slate-600"
          >
            Full Name *
          </Label>
          <Input
            id="full_name"
            {...register('full_name')}
            placeholder="Dr. Priya Sharma"
            className="h-11 rounded-xl"
          />
          {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label
            htmlFor="street_address"
            className="font-bold text-xs uppercase tracking-wider text-slate-600"
          >
            Street Address *
          </Label>
          <Input
            id="street_address"
            {...register('street_address')}
            placeholder="123 Medical Colony, Sector 4"
            className="h-11 rounded-xl"
          />
          {errors.street_address && (
            <p className="text-xs text-red-500">{errors.street_address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="city"
            className="font-bold text-xs uppercase tracking-wider text-slate-600"
          >
            City *
          </Label>
          <Input id="city" {...register('city')} placeholder="Mumbai" className="h-11 rounded-xl" />
          {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="state"
            className="font-bold text-xs uppercase tracking-wider text-slate-600"
          >
            State *
          </Label>
          <Input
            id="state"
            {...register('state')}
            placeholder="Maharashtra"
            className="h-11 rounded-xl"
          />
          {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="postal_code"
            className="font-bold text-xs uppercase tracking-wider text-slate-600"
          >
            PIN Code *
          </Label>
          <Input
            id="postal_code"
            {...register('postal_code')}
            placeholder="400001"
            className="h-11 rounded-xl"
            maxLength={6}
          />
          {errors.postal_code && (
            <p className="text-xs text-red-500">{errors.postal_code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="font-bold text-xs uppercase tracking-wider text-slate-600"
          >
            Phone *
          </Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="+91 9876543210"
            className="h-11 rounded-xl"
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl font-bold text-base gap-2 shadow-lg shadow-primary/20"
      >
        Continue to Review <ArrowRight className="w-4 h-4" />
      </Button>
    </form>
  );
}
