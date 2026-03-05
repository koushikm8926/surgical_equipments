import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const QuoteSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  institution_name: z.string().min(2),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
  product_id: z.string().uuid(),
  product_name: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = QuoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { name, email, phone, institution_name, quantity, notes, product_id, product_name } =
      parsed.data;

    const supabase = await createClient();

    const { error } = await supabase.from('contact_submissions').insert({
      name,
      email,
      phone,
      subject: `Quote Request: ${product_name}`,
      message: notes || 'No additional notes',
      type: 'quote_request',
      product_id,
      quantity_requested: quantity,
      institution_name,
    });

    if (error) {
      console.error('Quote submission error:', error);
      return NextResponse.json({ error: 'Failed to save quote request' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Quote API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
