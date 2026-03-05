'use client';

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ArrowLeft, Lock, CreditCard } from 'lucide-react';

interface Props {
  orderId: string;
  onBack: () => void;
}

export function StepPayment({ orderId, onBack }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/${orderId}/confirmation`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? 'Payment failed. Please try again.');
      setIsLoading(false);
    }
    // On success, Stripe redirects to the return_url
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 text-primary rounded-xl">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Payment</h2>
          <p className="text-sm text-slate-500">Your payment is secured by Stripe.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <Lock className="w-3 h-3" />
        <span>256-bit SSL encryption. Your card details are never stored on our servers.</span>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-12 rounded-xl font-bold gap-2"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
          disabled={!stripe || isLoading}
        >
          {isLoading ? 'Processing payment...' : 'Pay & Place Order'}
        </Button>
      </div>
    </form>
  );
}
