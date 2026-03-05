import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createClient();

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;

    // Update order status to 'processing'
    const { data: order } = await supabase
      .from('orders')
      .update({ status: 'processing' })
      .eq('stripe_payment_intent_id', intent.id)
      .select('id, user_id')
      .single();

    // Clear user's cart from Supabase
    if (order?.user_id) {
      await supabase.from('cart_items').delete().eq('user_id', order.user_id);
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent;

    await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('stripe_payment_intent_id', intent.id);
  }

  return NextResponse.json({ received: true });
}
