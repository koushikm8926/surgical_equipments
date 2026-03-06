'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutProgress } from '@/components/checkout/checkout-progress';
import { StepShipping, ShippingAddress } from '@/components/checkout/step-shipping';
import { StepReview } from '@/components/checkout/step-review';
import { StepPayment } from '@/components/checkout/step-payment';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [intentError, setIntentError] = useState('');

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.replace('/products');
    }
  }, [items, router]);

  const handleShippingDone = (data: ShippingAddress) => {
    setShippingAddress(data);
    setStep(2);
  };

  const handleCreateIntent = async (isDemo = false) => {
    if (!shippingAddress) return;
    setIsCreatingIntent(true);
    setIntentError('');

    try {
      const res = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shipping_address: shippingAddress, is_demo: isDemo }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIntentError(data.error ?? 'Failed to initialize payment');
        setIsCreatingIntent(false);
        return;
      }

      if (data.isDemo) {
        // Clear cart and redirect to confirmation
        router.push(`/orders/${data.orderId}/confirmation`);
        return;
      }

      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setStep(3);
    } catch {
      setIntentError('Network error. Please try again.');
    } finally {
      setIsCreatingIntent(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 font-medium">Your cart is empty.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-xl text-primary mb-6"
          >
            SurgicalStore
          </Link>
          <CheckoutProgress currentStep={step} />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          {step === 1 && <StepShipping onNext={handleShippingDone} />}

          {step === 2 && shippingAddress && (
            <>
              {intentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
                  {intentError}
                </div>
              )}
              <StepReview
                items={items}
                address={shippingAddress}
                onNext={handleCreateIntent}
                onBack={() => setStep(1)}
                isLoading={isCreatingIntent}
              />
            </>
          )}

          {step === 3 && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#2563eb',
                    borderRadius: '12px',
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                  },
                },
              }}
            >
              <StepPayment orderId={orderId} onBack={() => setStep(2)} />
            </Elements>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By placing your order, you agree to our{' '}
          <Link href="/resources" className="underline hover:text-primary">
            Terms & Conditions
          </Link>
        </p>
      </div>
    </div>
  );
}
