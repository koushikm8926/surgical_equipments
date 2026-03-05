'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, FileText, Loader2, CheckCircle2, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const QuoteSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Phone required'),
  institution_name: z.string().min(2, 'Institution name required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  notes: z.string().optional(),
});

type QuoteForm = z.infer<typeof QuoteSchema>;

interface Props {
  productId: string;
  productName: string;
}

export function QuoteRequestButton({ productId, productName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuoteForm>({
    resolver: zodResolver(QuoteSchema),
  });

  const onSubmit = async (data: QuoteForm) => {
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, product_id: productId, product_name: productName }),
    });

    if (res.ok) {
      setIsSuccess(true);
      reset();
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
      }, 3000);
    } else {
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2 rounded-xl font-bold border-primary/30 hover:bg-primary/5 hover:border-primary"
      >
        <FileText className="w-4 h-4" />
        Request a Quote
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-5 border-b border-slate-100 flex items-start justify-between rounded-t-2xl z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-slate-900">Request a Quote</h2>
                </div>
                <p className="text-sm text-slate-500">
                  For <span className="font-bold text-slate-700">{productName}</span>
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {isSuccess ? (
              <div className="p-10 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">Quote Submitted!</p>
                  <p className="text-slate-500 text-sm mt-1">
                    Our team will contact you within 24 hours with a custom quote.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-600">
                      Your Name *
                    </Label>
                    <Input
                      {...register('name')}
                      placeholder="Dr. Sharma"
                      className="h-11 rounded-xl"
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-600">
                      Phone *
                    </Label>
                    <Input
                      {...register('phone')}
                      placeholder="+91 9876543210"
                      className="h-11 rounded-xl"
                    />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-xs uppercase tracking-wider text-slate-600">
                    Email *
                  </Label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="doctor@hospital.com"
                    className="h-11 rounded-xl"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-xs uppercase tracking-wider text-slate-600">
                    Institution / Hospital *
                  </Label>
                  <Input
                    {...register('institution_name')}
                    placeholder="Apollo Hospital, Mumbai"
                    className="h-11 rounded-xl"
                  />
                  {errors.institution_name && (
                    <p className="text-xs text-red-500">{errors.institution_name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-xs uppercase tracking-wider text-slate-600">
                    Required Quantity *
                  </Label>
                  <Input
                    {...register('quantity', { valueAsNumber: true })}
                    type="number"
                    min={1}
                    placeholder="e.g. 10"
                    className="h-11 rounded-xl"
                  />
                  {errors.quantity && (
                    <p className="text-xs text-red-500">{errors.quantity.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-xs uppercase tracking-wider text-slate-600">
                    Additional Notes
                  </Label>
                  <Textarea
                    {...register('notes')}
                    placeholder="Any specific requirements, delivery timeline, compliance needs..."
                    className="rounded-xl min-h-[80px]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    'Submit Quote Request'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
