import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CartItemSchema = z.object({
  product: z.object({
    id: z.string().uuid(),
    name: z.string(),
    price: z.number().positive(),
    image_url: z.string().nullable().optional(),
  }),
  quantity: z.number().int().positive(),
});

const CheckoutBodySchema = z.object({
  items: z.array(CartItemSchema).min(1),
  shipping_address: z.object({
    full_name: z.string().min(1),
    street_address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postal_code: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().min(1),
  }),
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CheckoutBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { items, shipping_address } = parsed.data;

    // Validate prices server-side — never trust client prices
    const productIds = items.map((i) => i.product.id);
    const { data: dbProducts } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity')
      .in('id', productIds);

    if (!dbProducts || dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: 'One or more products not found' }, { status: 400 });
    }

    // Calculate total server-side
    let subtotal = 0;
    for (const item of items) {
      const dbProduct = dbProducts.find((p) => p.id === item.product.id);
      if (!dbProduct) return NextResponse.json({ error: 'Product not found' }, { status: 400 });
      if (dbProduct.stock_quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${dbProduct.name}` },
          { status: 400 },
        );
      }
      subtotal += Number(dbProduct.price) * item.quantity;
    }

    const gst = subtotal * 0.18;
    const totalAmount = Math.round((subtotal + gst) * 100); // paise

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'inr',
      metadata: { user_id: user.id },
    });

    // Create pending order in DB
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        total_amount: (subtotal + gst).toFixed(2),
        shipping_address,
        stripe_payment_intent_id: paymentIntent.id,
      })
      .select('id')
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Insert order items
    const orderItems = items.map((item) => {
      const dbProduct = dbProducts.find((p) => p.id === item.product.id)!;
      return {
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_time: Number(dbProduct.price),
      };
    });

    await supabase.from('order_items').insert(orderItems);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (err) {
    console.error('create-payment-intent error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
